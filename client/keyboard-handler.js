Meteor.startup(function() {
    window.addEventListener('keypress', function(e) {
        if (e.metaKey) return;
        var focus = $(':focus').length;
        var code = e.which || e.keyCode;
        if (!focus && code == 99 ) { // c -> new note
            $('#new_note').focus();
            e.preventDefault();
        } else if (!focus && code == 97 ) { // a -> add/find person
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
        } else if ( focus && code == 27 ) { // Escape, lets blur?
            e.target.blur();
        } else if ( !focus ) {
            console.log("code: " + code);
        }
    });
});
