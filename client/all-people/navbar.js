Template["all-people-navbar"].group_count = function() {
    return Groups.find().count();
};
Template["all-people-navbar"].selected_group = function() {
    var group = Groups.findOne(Session.get("selected_group"));
    if (group) return group.name;
    return;
};
Template["all-people-navbar"].events = {
    'click #addglobaltask': function() {
        /*
        $('#addglobaltask').popover({
            'html': true,
            'placement': 'bottom'
        });
        */
        var task = window.prompt("Task title", "");

        if (! task) {
            return;
        }
        Meteor.call("add_global_task", task,1,  Session.get("selected_group"), function(err, id) {
            // Task added?
            console.log("back from add_global_task", err, id);
        });
    },
    'click #add_button': function() {
        var name = document.getElementById('person_name').value;
        // XXX: Should probably display something here :P
        if (name.match(/^\s*$/)) return;
        // check if name exists
        var p = People.findOne({key: name.toLowerCase()});
        var g;
        if (p) {
            Session.set("selected_person", p._id);
            if (p.group) {
                g = Groups.findOne({name: p.group});
                Session.set("selected_group", g._id);
            } else {
                // the person isn't in a group, so lets change to "no group
                // selected"
                Session.set("selected_group");
            }
        } else {
            Meteor.call("create_person", name, Session.get("selected_group"), function(err, id) {
                console.log("Back from create_person", err, id);
                Session.set("selected_user", id);
            });

        }
    },
    'keydown input': function(e) {
        var code = e.which || e.keyCode;

        if (code == 13) {
            $(e.target).parent().find('button').click();
            e.target.value = '';
            e.preventDefault();
            e.target.blur();
        } else if ( code == 27 ) {
            e.target.value = '';
            e.target.blur();
        }
    },
    'click #addgroupbtn': function() {
        var n = $('#groupname').val();
        // XXX: Should probably display something here :P
        if (n.match(/^\s*$/)) { return; }

        Session.set("selected_player");
        var g = Groups.findOne({name: n});
        if (g) {
            Session.set("selected_group", g._id);
        } else {
            Meteor.call("create_group", n, function(err, id) {
                Session.set("selected_group", id);
            });
        }
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

