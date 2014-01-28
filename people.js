
People = new Meteor.Collection("people");
Groups = new Meteor.Collection("groups");
PeopleLabels = new Meteor.Collection("peoplelabels");



if (Meteor.isClient) {

    Template.people.people = function() {
        var group = Groups.findOne(Session.get("selected_group"));
        var q;
        if (group) {
            q = {
                group: group.name
            };
        } else {
            q = {
                group: { $in: [ null, undefined ] }
            };
        }
        return People.find(q, {sort: {name: 1}});
    };


    Template.selectedperson.events = {
        'click .cmd-enter': function() {
            var txt = document.getElementById('new_note').value;
            document.getElementById('new_note').value = '';
            if (txt.match(/^\s*$/)) return;
            var n = parseNote(txt);
            Meteor.call('note_save', Session.get("selected_person"), null, n, function(err, stat) {
                console.log("Back from note_save new note", err, stat);
            });
        }
    };
    Template.person_action.events = {
        'click .action .complete': function() {
            Meteor.call("mark_action_as_done", this, Session.get("selected_person"), function(err, stat) {
                console.log("Back from mark: ", err, stat);
            });
        },
        'click .action .trash': function() {
            Meteor.call("action_trash", Session.get("selected_person"), this, function(err, stat) {
                console.log("Back from trash action", err, stat);
            });
        }
    };

    Template.person_note.tag_color = function() {
        for (var i = 0, hash = 0; i < this.length; i++) {
            hash = this.charCodeAt(i) + (( hash << 5) - hash);
        }
        for (var i = 0, colour = '#'; i < 3; i++) {
            var v = (hash >> (i * 8)) & 0xFF;

            colour += ("00" + v.toString(16)).substr(-2);
        }
        return colour;
    };
    Template.person_note.tag_text_color = function() {
        var color = Template.person_note.tag_color.apply(this);
        var bg = color;
        color = color.substring(1);           // remove #
        var c = new Object;
        c.R = parseInt(color.slice(0,2), 16);
        c.G = parseInt(color.slice(2,4), 16);
        c.B = parseInt(color.slice(4,6), 16);
        var a = 1 - (0.299 * c.R + 0.587 * c.G + 0.114 * c.B)/255;
        console.log(bg, a);
        return a < 0.5 ? "black" : "white; font-weight: 200; text-shadow: 0px 0px 0.5px white;";
    }

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
