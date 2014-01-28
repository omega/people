Router.configure
  layoutTemplate: "layout"

check_login = () ->
  unless Meteor.user()
    this.render 'welcome'
    this.stop()

Router.map () ->
    this.route 'dashboard',
        path: '/'
        before: check_login
        template: 'dashboard'
        yieldTemplates:
          'dashboard-navbar':
            to: 'navbar'
    this.route 'all-people',
        path: '/people'
        template: 'all-people'
        before: check_login
        yieldTemplates:
          'all-people-navbar':
            to: 'navbar'


