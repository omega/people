Template.selectedperson.rendered = ->
  $('#person-menu').affix({ offset: 12 })

Template.selectedperson.selected_person = ->
  return People.findOne Session.get "selected_person"

Template.selectedperson.events =
  'click .cmd-enter': ->
    txt = document.getElementById('new_note').value
    document.getElementById('new_note').value = ''
    return if txt.match /^\s*$/
    n = parseNote txt
    Meteor.call 'note_save', Session.get("selected_person"), null, n, (err, stat) ->
      console.log "back from note_save new note", err, stat

Template.person_action.events =
  'click .action .complete': ->
    Meteor.call "action_mark_as_done", this, Session.get("selected_person"), (err, stat) ->
      console.log "Back from action_mark_as_done", err, stat
  'click .action .trash': ->
    Meteor.call "action_trash", this, Session.get("selected_person"), (err, stat) ->
      console.log "Back from action_trash", err, stat


Template.person_note.tag_color = ->
  i = 0
  hash = 0
  while i < this.length
    hash = this.charCodeAt(i) + (( hash << 5) - hash)
    i++
  color = "#"
  i = 0
  while i < 3
    v = (hash >> (i * 8)) & 0xFF
    color += ("00" + v.toString(16)).substr -2
    i++
  return color

Template.person_note.tag_text_color = ->
  color = Template.person_note.tag_color.apply(this).substring(1)
  c =
    R: parseInt color.slice(0,2), 16
    G: parseInt color.slice(2,4), 16
    B: parseInt color.slice(4,6), 16
  a = 1 - (0.299 * c.R + 0.587 * c.G + 0.114 * c.B)/255
  return if a > 0.5 then "white; font-weight: 200; text-shadow: 0px 0px 0.5px white;"  else "black"
Template.person_note.events =
  'click .toolbox .email': (e) ->
    e.stopPropagation()
    p = People.findOne Session.get "selected_person"
    email = window.prompt "Email address", p.email or "a@b.c"
    if email
      # Add the email to the user, so we can reuse it later
      Meteor.call 'person_set_export_mail', Session.get("selected_person"), email, (err, res) ->
        console.log "Back from person_set_export_mail, ", err, res
      return Meteor.call 'note_email', this, email, (err, stat) ->
        console.log "Back from note_email", err, stat

  'click .toolbox .icon-trash': (e) ->
    e.stopPropagation()
    return Meteor.call 'note_trash', Session.get("selected_person"), this, (err, stat) ->
      console.log "Back from note_trash", err, stat

  'click .toolbox .edit': (e) ->
    $(e.target).closest('dd').find('.form-behind').toggle()
    $(e.target).closest('dd').find('.form-ahead').toggle()
    e.stopPropagation()

  'click .save-note': (e) ->
    t = $(e.target).closest('.form-behind').find('.edit-note').val()
    if t == @origText
      $(e.target).closest('dd').find('.form-behind').toggle()
      $(e.target).closest('dd').find('.form-ahead').toggle()
      return
    n = parseNote t
    return Meteor.call 'note_save', Session.get("selected_person"), this, n, (err, stat) ->
      console.log "Back from note_save", err, stat

  'click .expand, click .person-note.collapsed': ->
    d = new Date @date;
    return Session.set "i" + d.getTime(), 1
  'click .collapser, click .person-note.expanded': (e) ->
    return if e.target.parentNode.parentNode.classList.contains 'form-behind'
    d = new Date @date
    return Session.set "i" + d.getTime(), 0


Template.sp_navbar.selected_person = Template.selectedperson.selected_person
Template.sp_navbar.group_count = Template["all-people-navbar"].group_count
Template.sp_navbar.person_labels_count = ->
  return PeopleLabels.find().count()
Template.sp_navbar.person_labels = ->
  return PeopleLabels.find({}, sort: {name: 1})

Template.sp_navbar.events =
  'click .remove-person': (e) ->
    id = e.target.getAttribute('data:user');
    Meteor.call 'person_remove', id, (err, stat) ->
      console.log "return from person_remove", err, stat
      if not err
        Session.set "selected_group"
        Session.set "selected_person"
  'click .group': ->
    console.log "group id", @_id
    id = @_id
    Meteor.call 'person_change_group', Session.get("selected_person"), @name, (err, stat) ->
      console.log "Return from person_change_group", err, stat
      if not err
        Session.set "selected_group", id

  'click .person-labels .new-label': ->
    label = window.prompt "Enter new label name"
    Meteor.call "add_person_label", label, (err, stat) ->
      console.log "back from add_person_label", err, stat
      # XXX: Should probably let the user know..?
      return if err
      Meteor.call "person_set_label", Session.get("selected_person"), label, (err, stat) ->
        console.log "Back from person_set_label", err, stat

  'click .person-labels .person-label': ->
    Meteor.call "person_set_label", Session.get("selected_person"), @name, (err, stat) ->
      console.log "Return from person_set_label", err, stat
  'click .person-labels .none': ->
    Meteor.call "person_set_label", Session.get("selected_person"), "", (err, stat) ->
      console.log "Return from person_set_label", err, stat

  'click .person-options .rename-person': ->
    newname = window.prompt "Enter new name"
    Meteor.call "person_rename", Session.get("selected_person"), newname, (err, stat) ->
      console.log "Return from rename_person", err, stat
  'click .person-options .person-set-email': ->
    email = window.prompt "Enter new email"
    Meteor.call 'person_set_export_mail', Session.get("selected_person"), email, (err, res) ->
      console.log "Back from person_set_export_mail, ", err, res
