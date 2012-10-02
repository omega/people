
var People = new Meteor.Collection("people");
var Groups = new Meteor.Collection("groups");


if (Meteor.is_client) {
    Handlebars.registerHelper('formatdate', function(object) {
        var date = moment(new Date(object));
        return new Handlebars.SafeString(date.fromNow());
    });

    //Meteor.subscribe("people");

    Template.people.people = function() {
        var group = Groups.findOne(Session.get("selected_group"));
        if (group) {
            group = group.name;
        }
        return People.find({group: group}, {sort: {name: 1}});
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
            var note = n.note;
                note.date = new Date();
            var q = {};
            if (!note.text.match(/^\s*$/)) {
                q['$push'] = {notes: note};
            }
            if (n.actions) {
                q['$pushAll'] = {actions: n.actions};
            }
            if(q) {
                console.log("updating");
                People.update(Session.get("selected_person"),q);
            }
        },
        'click .remove-person': function(e) {
            var id = e.target.getAttribute('data:user');

            People.remove({_id: id});
        },
        'click .group': function() {
            People.update(Session.get("selected_person"), {'$set': {group: this.name}});
            Session.set("selected_person");
        }
    };
    Template.person_action.events = {
        'click .action .complete': function() {
            People.update({
                '_id': Session.get("selected_person"),
                'actions': this
            },
            {
                '$set': {'actions.$.done': new Date()}
            });
        },
        'click .action .trash': function() {
            People.update(Session.get("selected_person"), {$pull: {actions: this}});
        }
    };
    Template.person_note.events = {
        'click .toolbox .icon-trash': function() {
            People.update(Session.get("selected_person"), {$pull: {notes: this}});
        },
        'click .toolbox .edit': function(e) {
            $(e.target).closest('dd').find('.form-behind').toggle();
            $(e.target).closest('dd').find('.form-ahead').toggle();
        },
        'click .save-note': function(e) {
            var t = $(e.target).closest('.form-behind').find('.edit-note').val();
            if (t == this.text) {
                $(e.target).closest('dd').find('.form-behind').toggle();
                $(e.target).closest('dd').find('.form-ahead').toggle();
                return;
            }
            var n = parseNote(t);
            var note = n.note;
            note.date = this.date;
            var q = {};
            if (!note.text.match(/^\s*$/)) {
                q['$set'] = {'notes.$': note};
            }
            if (n.actions) {
                q['$pushAll'] = {actions: n.actions};
            }
            if(q) {
                People.update({
                    '_id': Session.get("selected_person"),
                    'notes': this
                }, q
                );
            }

        }
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

    Template.navbar.group_count = function() {
        return Groups.find().count();
    };
    Template.navbar.selected_group = function() {
        var group = Groups.findOne(Session.get("selected_group"));
        if (group) return group.name;
        return;
    };
    Template.navbar.events = {
        'click #add_button': function() {
            var name = document.getElementById('person_name').value;
            // XXX: Should probably display something here :P
            if (name.match(/^\s*$/)) return;
            // check if name exists
            var p = People.findOne({key: name.toLowerCase()});
            var g;
            if (p) {
                g = Groups.findOne({name: p.group});
                p = p._id;
                Session.set("selected_group", g._id);
            } else {
                g = Groups.findOne(Session.get("selected_group"));
                if (g) {
                    g = g.name;
                }
                p = People.insert({name: name, group: g, key: name.toLowerCase()});
            }
            Session.set("selected_person", p);
        },
        'keydown input': function(e) {
            var code = e.which || e.keyCode;

            if (code == 13) {
                $(e.target).siblings('button').click();
                e.target.value = '';
            } else if ( code == 27 ) {
                e.target.value = '';
                e.target.blur();
            }
        },
        'click #addgroupbtn': function() {
            var n = $('#groupname').val();
            // XXX: Should probably display something here :P
            if (n.match(/^\s*$/)) { return; }

            var g = Groups.findOne({name: n});
            if (g) {
                g = g._id;
            } else {
                g = Groups.insert({name: n});
            }
            Session.set("selected_group", g);
            Session.set("selected_player");
        },
        'click .none': function() {
            // clear out selected_group
            Session.set('selected_group');
            Session.set("selected_person");
        },
        'click .group': function() {
            Session.set("selected_group", this._id);
            Session.set("selected_person");
        }
    };

    Meteor.startup(function() {
        $('#addGroup').modal({
            keyboard: false,
            show : false
        });
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

if (Meteor.is_server) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    //Meteor.publish("people", function() {
        //return People.find({});
    //});
}
