
Template.loginform.events = {
    'click .login': function(e) {
        console.log("logging in");
        var u = $(e.target).siblings('input[type="text"]').val();
        var p = $(e.target).siblings('input[type="password"]').val();
        Meteor.loginWithPassword(u, p, function(err) {
            if (err) {
                // XXX: Should handle errors in a global way..
                console.log("error logging in");
            }
        });
    }
};
Template.loggedInUser.events = {
    'click .logout': function(e) {
        Meteor.logout();
    }
};

