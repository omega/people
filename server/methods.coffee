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
  mark_action_as_done: (actions, person) ->
    console.log "marking ", actions, "as done"
    People.update({
      _id: person
      actions: actions
    }, {
      '$set': {'actions.$.done': new Date()}
    })

