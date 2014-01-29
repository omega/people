Template.people.people = () ->
  group = Groups.findOne Session.get "selected_group"
  q = group: if group then group.name else "$in": [null, "undefined"]
  console.log q
  return People.find q, sort: name: 1
