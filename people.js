
People = new Meteor.Collection("people");
Groups = new Meteor.Collection("groups");
PeopleLabels = new Meteor.Collection("peoplelabels");

Attachments = new FS.Collection('attachments', {
    autopublish: false,
    stores: [ new FS.Store.GridFS('attachments',{}) ]
});


