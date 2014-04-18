Meteor.subscribe "people"
Meteor.subscribe "groups"
Meteor.subscribe "peoplelabels"

Deps.autorun ->
  selected_person = Session.get "selected_person"
  Meteor.subscribe "personattachments", selected_person
