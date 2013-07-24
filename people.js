
People = new Meteor.Collection("people");
Groups = new Meteor.Collection("groups");


if (Meteor.is_client) {
    Handlebars.registerHelper('formatdate', function(object) {
        var date = moment(new Date(object));
        return new Handlebars.SafeString(date.fromNow());
    });
    Handlebars.registerHelper('noteid', function(object) {
        var d = new Date(object.date);
        return new Handlebars.SafeString(d.getTime());
    });

    Meteor.subscribe("people");
    Meteor.subscribe("groups");

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

    Template.selectedperson.selected_person = function() {
        var person = People.findOne(Session.get("selected_person"));
        return person;
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
        },
        'click .remove-person': function(e) {
            var id = e.target.getAttribute('data:user');
            Meteor.call('person_remove', id, function(err, stat) {
                console.log("return from person_remove", err, stat);
                if (!err) {
                    Session.set("selected_group");
                    Session.set("selected_person");
                }
            });
        },
        'click .group': function() {
            var self = this;
            Meteor.call('person_change_group', Session.get("selected_person"), this.name, function(err, stat) {
                console.log("Return from person_change_group", err, stat);
                if (!err) {
                    Session.set("selected_group", self._id);
                }
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
    Template.person_note.events = {
        'click .toolbox .icon-trash': function() {
            Meteor.call('note_trash', Session.get("selected_person"), this, function(err, stat) {
                console.log("Back from note_trash", err, stat);
            });
        },
        'click .toolbox .edit': function(e) {
            $(e.target).closest('dd').find('.form-behind').toggle();
            $(e.target).closest('dd').find('.form-ahead').toggle();
        },
        'click .save-note': function(e) {
            var t = $(e.target).closest('.form-behind').find('.edit-note').val();
            console.log(t, this.origText);
            if (t == this.origText) {
                $(e.target).closest('dd').find('.form-behind').toggle();
                $(e.target).closest('dd').find('.form-ahead').toggle();
                return;
            }
            var n = parseNote(t);
            Meteor.call('note_save', Session.get("selected_person"), this, n, function(err, stat) {
                console.log("Back from note_save", err, stat);
            });
        },
        'click .expand': function() {
            var d = new Date(this.date);
            Session.set("i" + d.getTime(), 1);
        },
        'click .collapser': function() {
            var d = new Date(this.date);
            Session.set("i" + d.getTime(), 0);
        }
    };


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


    Meteor.startup(function() {
        window.addEventListener('keypress', function(e) {
            var focus = $(':focus').length;
            var code = e.which || e.keyCode;
            if (!focus && code == 99 ) {
                $('#new_note').focus();
                e.preventDefault();
            } else if (!focus && code == 97 ) {
                $('#person_name').focus();
                e.preventDefault();
            }

        });

        window.addEventListener('keydown',  function(e) {
            var focus = $(':focus').length;
            var code = e.which || e.keyCode;
            //console.log(e);
            if (e.metaKey) {
                // down: 40, up: 38, 13: enter
                if ( code == 13 ) { // cmd-enter
                    // lets look for a cmd-enter class nearby.
                    var btn = $(e.target).closest('form').find('.cmd-enter');
                    btn.get(0).click();
                } else if ( !focus && code == 38 ) { // cmd-up
                    var active = $('.people .active');
                    var prev = active.prev('.person');
                    if (prev.length) {
                        prev.get(0).click();
                    } else {
                        var last = $('.people .person:last-child a').get(0);
                        if (last) last.click();
                    }
                    e.preventDefault();
                } else if ( !focus && code == 40 ) { // cmd-down
                    var active = $('.people .active');
                    var next = active.next('.person');
                    if (next.length) {
                        next.get(0).click();
                    } else {
                        var first = $('.people .person').get(0);
                        if (first) first.click();
                    }
                    e.preventDefault();
                }
            } else if ( !focus ) {
                console.log("code: " + code);
            }
        });
    });
}
