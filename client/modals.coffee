
Template.userSettings.events
  'click .save': ->
    Meteor.call "user_save_settings", $('#userEmail').val()
    $('#userSettings').modal('hide');

Template.userSettingsContent.helpers
  email: ->
    u = Meteor.user()
    return unless u
    return u.emails?[0].address
Template.userSettingsContent.events
  'submit form': (e) ->
    e.preventDefault()
    Meteor.call "user_save_settings", $('#userEmail').val()
    $('#userSettings').modal('hide');

