
People = new Meteor.Collection("people");
Groups = new Meteor.Collection("groups");
PeopleLabels = new Meteor.Collection("peoplelabels");



if (Meteor.isClient) {

    Template.person_note.expanded_class = function() {
        var d = new Date(this.date);
        return Session.equals("i" + d.getTime(), 1) ? 'expanded' : 'collapsed';
    };
    Template.person_note.expanded = function() {
        var d = new Date(this.date);
        return Session.equals("i" + d.getTime(), 1);
    };


    Template.person.selected_class = function() {
        return Session.equals("selected_person", this._id) ? "active": '';
    };
    Template.person.note_count = function() {
        var p = People.findOne(this._id);
        if (!p) return;
        if (!p.actions) return;
        return p.actions.filter(function(e) {return !e.done}).length;
    };

    Template.person.events = {
        "click": function() {
            Session.set("selected_person", this._id);
        }
    };
    Template.groups.groups = function() {
        return Groups.find({}, {sort: {name: 1}});
    };
    Template.group.selected_class = function() {
        return Session.equals("selected_group", this._id) ? "active": '';
    };


}
