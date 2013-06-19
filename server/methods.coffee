Meteor.methods
  create_group: (name) ->
    if not this.userId
      console.log "Not logged in, not creating anything"
      return
    return Groups.insert owner: this.userId, name: name
  user_exists: (name) ->
    return Meteor.users.find( username: name ).count()
  create_person: (name, group) ->
    if not this.userId
      console.log "Not logged in, not creating a new person"
      return
    g = Groups.findOne group
    g = g.name if g

    console.log "    group", g
    return People.insert
      name: name
      group: g
      key: name.toLowerCase()
      owner: this.userId
  person_change_group: (person, name) ->
    console.log "Changing group of #{person} to #{name}"
    return People.update person, $set: group: name


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
  action_trash: (person, action) ->
    console.log "Deleting action ", action
    return People.update person, '$pull': actions: action


# Methods for Notes
Meteor.methods
  note_save: (person, input_note, parsed_note) ->
    console.log "saving note on #{person}", parsed_note
    note = parsed_note.note

    q = {}
    s = {}
    if input_note
      note.date = input_note.date
      s =
        _id: person
        notes: input_note
    else
      note.date = new Date()
      s = person

    if not note.text.match /^\s*$/
      if input_note
        q.$set = 'notes.$': note
      else
        q.$push = notes: note
    if parsed_note.actions
      q.$pushAll = actions: parsed_note.actions
    if q
      People.update s, q

  note_trash: (person, note) ->
    console.log "deleting note on #{person}", note
    return People.update person, '$pull': notes: note


