function addError(input, error) {
    input.parent().addClass("error");
    input.tooltip({
        placement: "bottom",
        trigger: "manual",
        title: error
    }).tooltip('show');
}
function removeError(input) {
    input.tooltip('destroy');
    input.parent().removeClass('error');
}


Template.loggedInUser.events = {
    'click .logout': function(e) {
        Meteor.logout();
    }
};
var userexiststimer;
Template.loginform.events = {
    'click .login': function(e) {
        console.log("logging in");
        var u = $(e.target).parent().find('input[type="text"]');
        var p = $(e.target).parent().find('input[type="password"]');
        Meteor.loginWithPassword(u.val(), p.val(), function(err) {
            if (err) {
                if (err.reason.match(/user/i)) {
                    addError(u, err.reason);
                } else if (err.reason.match(/password/i)) {
                    addError(p, err.reason);
                }
                console.error(err);
            } else {
                console.log("error logging in");
            }
        });
    },
    'keyup input[name="username"]': function(e) {
        console.log("keyup on ", e.target);
        var i = $(e.target);
        var v = i.val();
        window.setTimeout(function() {
            if (i.val() == v) {
                console.log("checking username, been same for a while");
                // value is still the same
                Meteor.call("user_exists", v, function(err, count) {
                    console.log("result from user_exists: ", count);
                    if (count) {
                        $('.btn.login').show();
                        $('.btn.adduser').hide();
                    } else {
                        $('.btn.adduser').show();
                        $('.btn.login').hide();
                    }
                    $('span.or').hide();
                    $('.btn.adduser').addClass('btn-primary');
                });
            }
        }, 200);
    },
    'focus input': function(e) {
        removeError($(e.target));
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
                    console.error(err);
                    if (err.reason.match(/exists/i)) {
                        // XXX: This might not be only user exists..
                        addError(u, err.reason);
                    }
                }
            });
        }
    }
};
