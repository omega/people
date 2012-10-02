Meteor.publish("people", function() {
    if (!this.userId()) {
        console.log("Not logged in, not returning anything");
        return;
    }
    return People.find({owner: this.userId()});
});
Meteor.publish("groups", function() {
    if (!this.userId()) {
        console.log("Not logged in, not returning any groups");
    }
    return Groups.find({owner: this.userId()});
});

Meteor.startup(function() {
    var canModify = function(userId, objs) {
        return _.all(objs, function(obj) {
            return obj.owner === userId;
        });
    };
    var allow = {
        insert: function() { return true; },
        update: canModify,
        remove: canModify,
        fetch: ['owner']
    };
    People.allow(allow);
    Groups.allow(allow);
});



Meteor.methods({
    create_group: function(name) {
        console.log("create group: ", name);
        if (!this.userId()) {
            console.log("Not logged in, not creating anything");
            return;
        }
        var id = Groups.insert({owner: this.userId(), name: name});
        return id;
    },
    create_person: function(name) {
        console.log("create person", name);
        if (!this.userId()) {
            console.log("Not logged in, not creating anything");
            return;
        }
        var g = Groups.findOne(Session.get("selected_group"));
        if (g) {
            g = g.name;
        }
        console.log("   group", g);
        var id = People.insert({
            name: name,
            group: g,
            key: name.toLowerCase(),
            owner: this.userId()
        });
        return id;
    }
});


