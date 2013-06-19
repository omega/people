Meteor.methods
  create_group: (name) ->
    if not self.userId
      console.log "Not logged in, not creating anything"
      return
    return Groups.insert owner: self.userId, name: name
  user_exists: (name) ->
    return Metor.users.find( username: name ).count()
  create_person: (name) ->
    if not self.userId
      console.log "Not logged in, not creating a new person"
      return
    g = Groups.findOne Session.get "selected_group"
    g = g.name if g

    console.log "    group", g
    return People.insert
      name: name
      group: g
      key: name.toLowerCase()
      owner: self.userId

# methods for actions
Meteor.methods
  mark_action_as_done: (actions, person) ->
    console.log "marking ", actions, "as done"
    return People.update({
      _id: person
      actions: actions
    }, {
      '$set': {'actions.$.done': new Date()}
    })
  action_trash: (actions, person) ->
    console.log "Deleting action ", actions
    return People.update person, { '$pull': {notes: actions} }


# Methods for Notes
Meteor.methods
  note_save: (person, input_note, parsed_note) ->
    console.log "saving note for #{person}", parsed_note
    note = parsed_note.note
    note.date = input_note.date
    q = {}
    if not note.text.match /^\s*$/
      q.$set = 'notes.$': note
    if parsed_note.actions
      q.$pushAll = actions: parsed_note.actions
    if q
      People.update
        _id: person
        notes: input_note
      , q

  note_trash: (person, note) ->
    console.log "deleting note on #{person}", note
    return People.update person, '$pull': notes: note


