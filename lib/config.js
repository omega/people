console.log("configuring accounts");
Meteor.accounts.config(
        {
            requireEmail: false,
            requireUsername: true,
            validateEmails: false
        });

