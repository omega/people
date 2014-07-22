UI.registerHelper 'formatdate', (object) ->
  date = moment new Date object
  return new Spacebars.SafeString date.fromNow()

UI.registerHelper 'noteid', (object) ->
  d = new Date object.date
  return new Spacebars.SafeString d.getTime()

UI.registerHelper 'gravatar', (object, size) ->
  if object?.email
    object = object.email
  g = new Gravatar object
  return g.url(size)
