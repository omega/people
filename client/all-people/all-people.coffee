Template.people.helpers
  people: ->
    console.log Template.people
    group = Groups.findOne Session.get "selected_group"
    q = group: if group then group.name else "$in": [null, "undefined"]
    return People.find q, sort: name: 1

Template.person.helpers
  selected_class: ->
    return if Session.equals "selected_person", @_id then "active"
  note_count: ->
    return People.findOne(@_id)?.actions?.filter( (e) -> !e.done ).length

Template.person.events =
  "click": ->
    return Session.set "selected_person", @_id

Template.groups.helpers
  groups: ->
    return Groups.find {}, sort: name: 1
  selected_class: ->
    return if Session.equals "selected_group", @_id then "active"
