#!/bin/bash

V=3.2.0
# download, bla bla
#

# unzip to client/lib/bootstrap-${V}
#

cd public/boostrap-${V}/less

for f in `ls *.less mixins/*.less`; do
    mv $f ${f%\.less}.import.less # to make it work better with meteor
done

cd .. # out of less directory

rm -rf docs test-infra dist grunt CNAME *.md _config.yml bower.json composer.json js/tests Gruntfile.js LICENSE package.json



