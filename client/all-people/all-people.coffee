Template.people.people = () ->
  group = Groups.findOne Session.get "selected_group"
  q = group: if group then group.name else "$in": [null, "undefined"]
  console.log q
  return People.find q, sort: name: 1


Template.person.selected_class = ->
  return if Session.equals "selected_person", @_id then "active"

Template.person.note_count = ->
  return People.findOne(@_id)?.actions?.filter( (e) -> !e.done ).length

Template.person.events =
  "click": ->
    return Session.set "selected_person", @_id

Template.groups.groups = ->
  return Groups.find {}, sort: name: 1

Template.group.selected_class = ->
  return if Session.equals "selected_group", @_id then "active"
