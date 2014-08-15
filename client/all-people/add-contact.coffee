
Template.add_contact_content.people = ->
  # XXX: Should filter out ourselves, and previous contacts?
  results = People.find().fetch().map( (it) ->
    return {name: it.name, value: it.key}
  )
  return results


Template.add_contact_content.selected_contact = (event, suggestion, dataset_name) ->

  person = People.findOne Session.get "selected_person"
  return "No selected_person" unless person
  Meteor.call "person_add_contact", person, suggestion.value
  jQuery('#add-contact').modal 'hide'


