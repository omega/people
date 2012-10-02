
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
function addError(input, error) {
    input.parent().addClass("error");
    input.tooltip({
        placement: "bottom",
        trigger: "manual",
        title: error
    }).tooltip('show');
}

Template.loginform.events = {
    'focus input': function(e) {
        $(e.target).tooltip('destroy');
        $(e.target).parent().removeClass('error');
    },
    'click .adduser': function(e) {
        var u = $(e.target).parent().find('input[type="text"]');
        var p = $(e.target).parent().find('input[type="password"]');
        var errors = 0;
        if (!u.val()) {
            errors++;
            addError(u, "You need to fill in a username");
        }
        if (!p.val()) {
            errors++;
            addError(p, "You need to fill in a password");
        }

        if (errors == 0) {
            Meteor.createUser({
                username: u.val(),
                password: p.val()
            }, {}, function(err) {
                if (err) {
                    if (err.error == 403) {
                        // XXX: This might not be only user exists..
                        addError(u, "Username already exists");
                    }
                }
            });
        }
    }
};
