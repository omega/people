Template.noteExporterTarget.helpers
  selected_person: ->
    cls = ""
    cls += " selected-person" if Session.equals "selected_person", @_id
    cls += " checked-contact" if (Session.get("note_exporter_selected") or []).indexOf(@_id) != -1
    cls += " no-email" unless @email
    return cls

  email_preview: ->
    return Session.get("note_exporter_note")?.text

  contacts: ->
    p = People.findOne Session.get "selected_person"

    # Now need to get the contacts and load the details?
    return [] unless p

    # We want ourselves in the list as well
    conts = p.contacts or []
    conts.unshift p._id

    q = _id: $in: conts
    contacts = People.find q

    console.log contacts
    return contacts


Template.noteExporter.events =
  'click .send-email': (event) ->
    # to send email
    return Meteor.call 'note_email', Session.get("note_exporter_note"), Session.get("note_exporter_selected"), (err, stat) ->
      console.log "Back from note_email", err, stat
      jQuery('#noteExporter').modal 'hide'
Template.noteExporterContent.events =
  'click .recipient': (event) ->
    console.log "recipient clicked"
    unless @email
      email = window.prompt "Enter email for #{@name} to be able to export", "a@b.c"
      if email != null and email != "a@b.c"
        Meteor.call 'person_set_export_mail', this, email, (err, res) ->
          console.log "back grom person_set_export_mail", err, res

    # XXX: this is not clean, as we aren't atomic?
    selected = Session.get("note_exporter_selected") or []
    if selected.indexOf(@_id) != -1
      # remove it?
      id = @_id
      console.log "clicked already selected contact, un-selected?"
      selected = selected.filter (value) ->
        console.log id, value
        if value == id then return 0 else return 1
    else
      selected.push @_id
    Session.set "note_exporter_selected", selected
    console.log "selected", selected

  'click .new-recipient': (event) ->
    console.log "in new-recipient"
    Meteor.typeahead.inject('.add-contact .typeahead')
    jQuery('#add-contact').modal()
