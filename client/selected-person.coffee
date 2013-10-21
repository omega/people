Template.selectedperson.rendered = ->
  $('#person-menu').affix({ offset: 12 })

Template.selectedperson.selected_person = ->
  return People.findOne Session.get "selected_person"


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
