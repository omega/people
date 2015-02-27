Router.configure
  layoutTemplate: "layout"

check_login = (pause) ->
  console.log "in check_login"
  unless Meteor.user()
    this.render 'welcome'
    pause()
  else
    this.next()
Router.onBeforeAction(check_login, {except: ['welcome']})
Router.map () ->
    this.route 'dashboard',
        path: '/'
        template: 'dashboard'
        yieldTemplates:
          'dashboard-navbar':
            to: 'navbar'
    this.route 'all-people',
        path: '/people'
        template: 'all-people'
        yieldTemplates:
          'all-people-navbar':
            to: 'navbar'
          'all-people-footer':
            to: 'footer'


