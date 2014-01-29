Meteor.methods
  add_person_label: (name) ->
    if not this.userId
      console.log "Not logged in, not adding person label"
      return
    old = PeopleLabels.findOne owner: @userId, name: name.toLowerCase()
    if old
      return old
    return PeopleLabels.insert owner: @userId, name: name.toLowerCase()

  add_global_task: (title, pri, group) ->
    if not this.userId
      console.log "Not logged in, not adding global task"
      return
    group = Groups.findOne group
    q = group: '$in': [null, undefined]
    if group
      q.group = group.name
    people = People.find q
    people.forEach (person) ->
      People.update person, '$push': actions:
        text: title
        pri: pri


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

    return People.insert
      name: name
      group: g
      key: name.toLowerCase()
      owner: this.userId
  person_change_group: (person, name) ->
    console.log "Changing group of #{person} to #{name}"
    return People.update person, $set: group: name

  person_remove: (person) ->
    console.log "Removing #{person}"
    return People.remove _id: person

  person_set_export_mail: (person, email) ->
    console.log "Saving #{email} on #{person}"
    return People.update person, $set: email: email

  person_set_label: (person, label) ->
    console.log "Setting label of #{person} to #{label}"
    return People.update person, $set: label: label

  person_rename: (person, newname) ->
    console.log "Renaming #{person} to #{newname}"
    return People.update person, $set: name: newname, key: newname.toLowerCase()


# methods for actions
Meteor.methods
  action_mark_as_done: (actions, person) ->
    console.log "marking ", actions, "as done"
    return People.update({
      _id: person
      actions: actions
    }, {
      '$set': {'actions.$.done': new Date()}
    })
  action_trash: (action, person) ->
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

  note_email: (note, email) ->
    return console.log "From email not set.." unless Meteor.settings.from_mail
    lines = note.text.split /\n\n/
    subj = lines[0]
    body = lines[1..-1].join "\n\n"
    Email.send
      from: Meteor.user()?.emails?[0]?.address or Meteor.settings.from_mail
      to: email
      subject: "Note from People: #{subj} (#{note.tags.join ', '})"
      text: note.text





# Methods for users, profile data etc

Meteor.methods
  user_save_settings: (email) ->
    console.log "updating user settings", email
    Meteor.users.update({_id: Meteor.user()._id}, '$set': emails: [{address: email}])

