Template.person_note.events =
  'click .toolbox .email': (e) ->
    p = People.findOne Session.get "selected_person"
    email = window.prompt "Email address", p.email or "a@b.c"
    if email
      # Add the email to the user, so we can reuse it later
      Meteor.call 'person_set_export_mail', Session.get("selected_person"), email, (err, res) ->
        console.log "Back from person_set_export_mail, ", err, res
      return Meteor.call 'note_email', this, email, (err, stat) ->
        console.log "Back from note_email", err, stat

  'click .toolbox .icon-trash': ->
    return Meteor.call 'note_trash', Session.get("selected_person"), this, (err, stat) ->
      console.log "Back from note_trash", err, stat

  'click .toolbox .edit': (e) ->
    $(e.target).closest('dd').find('.form-behind').toggle();
    $(e.target).closest('dd').find('.form-ahead').toggle();
  'click .save-note': (e) ->
    t = $(e.target).closest('.form-behind').find('.edit-note').val();
    if t == @origText
      $(e.target).closest('dd').find('.form-behind').toggle();
      $(e.target).closest('dd').find('.form-ahead').toggle();
      return;
    n = parseNote t;
    return Meteor.call 'note_save', Session.get("selected_person"), this, n, (err, stat) ->
      console.log "Back from note_save", err, stat

  'click .expand, click .person-note.collapsed': ->
    d = new Date @date;
    return Session.set "i" + d.getTime(), 1
  'click .collapser, click .person-note.expanded': ->
    d = new Date @date
    return Session.set "i" + d.getTime(), 0
