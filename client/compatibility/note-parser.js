function parseNote(text) {
    // Looks for special stuff, and returns that in a complex object back
    // to caller
    var note = { origText: text };

    var actions = new Array();
    var actions_re = /^(!+)(.*)(?:\n|$)/;
    while (text.search(actions_re) != -1) {
        text = text.replace(actions_re, function(match, p1, p2) {
            actions.push({
                text: p2.trim(),
                pri: p1.length > 3 ? 3 : p1.length
            });
            return "";
        });
    }

    note.origText = text;


    var tags = new Array();
    var tags_re = /^(?:\s*)#([\w\-]+)/i;
    while (text.search(tags_re) != -1) {
        text = text.replace(tags_re, function(match, p1) {
            tags.push(p1.trim());
            return "";
        });
    }
    if ( tags ) {
        //console.log( tags );
        note.tags = tags;
    }

    // Lets get out message:// links, if we can
    // message://%3cTHJDBAGENT1wWGNnuRv0070cd8e@thidc70.mail.jobsdb.co.th%3e
    var message_links_re = /\b(message:\/\/%3c.*%3e(?!\)))\b/i;
    while (text.search(message_links_re) != -1) {
        text = text.replace(message_links_re, function(match, p1) {
            return "[Mail message](" + p1.trim() + ")";
        });
    }

    note.text = text.trim();
    return {note: note, actions: actions};
};
