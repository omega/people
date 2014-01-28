Handlebars.registerHelper 'formatdate', (object) -> 
  date = moment new Date object
  return new Handlebars.SafeString date.fromNow()

Handlebars.registerHelper 'noteid', (object) ->
  d = new Date object.date
  return new Handlebars.SafeString d.getTime()

Handlebars.registerHelper 'gravatar', (object) ->
  if object?.email
    object = object.email
  g = new Gravatar object
  return g.url()
