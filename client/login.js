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
var UEtimer;
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
                console.log("No error logging in", err, Meteor.userId);
            }
        });
    },
    'keyup input[name="username"]': function(e) {
        if (typeof(UEtimer) == "number") {
            window.clearTimeout(UEtimer);
        }
        var i = $(e.target);
        var v = i.val();
        if (v) {
            UEtimer = window.setTimeout(function() {
                if (i.val() == v) {
                    // value is still the same
                    Meteor.call("user_exists", v, function(err, count) {
                        if (i.val() == v) {
                            if (count) {
                                $('.btn.login').prop('disabled', false).addClass('btn-primary');
                                $('.btn.adduser').prop('disabled', true).removeClass('btn-primary');
                            } else {
                                $('.btn.adduser').prop('disabled', false).addClass('btn-primary');
                                $('.btn.login').prop('disabled', true).removeClass('btn-primary');

                            }
                        }
                    });
                }
            }, 200);
        } else {
            $('.btn.adduser').prop('disabled', false).removeClass('btn-primary');
            $('.btn.login').prop('disabled', false).addClass('btn-primary');
        }
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
            Accounts.createUser({
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
