Package.describe({
    summary: "Our in-house gravatar package, based on https://github.com/tmeasday/meteor-gravatar"
});
Npm.depends({"MD5": "1.2.0"});

Package.on_use(function(api) {
    api.use('crypto-md5', ['client', 'server']);
    if (api.export) {
        api.export('Gravatar');
    }
    api.add_files('gravatar.js', ['client', 'server']);
});

