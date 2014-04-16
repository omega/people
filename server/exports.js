Meteor.publish("people", function() {
    if (this.userId) {
        return People.find({owner: this.userId});
    }
});
Meteor.publish("groups", function() {
    if (this.userId) {
        return Groups.find({owner: this.userId});
    }
});
Meteor.publish("peoplelabels", function() {
    if (this.userId) {
        return PeopleLabels.find({owner: this.userId});
    }
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
    PeopleLabels.allow(allow);
});



