Template.person_note.events =
  'click .toolbox .email': (e) ->
    return console.log "Should email"
  'click .toolbox .icon-trash': (e) ->
    return Meteor.call('note_trash', Session.get("selected_person"), this, (err, stat) ->
      console.log("Back from note_trash", err, stat);
    )
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
    return Meteor.call('note_save', Session.get("selected_person"), this, n, (err, stat) ->
      console.log("Back from note_save", err, stat);
    )

  'click .expand': ->
    d = new Date @date;
    return Session.set "i" + d.getTime(), 1
  'click .collapser': ->
    d = new Date this.date
    return Session.set "i" + d.getTime(), 0
