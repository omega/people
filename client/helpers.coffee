UI.registerHelper 'formatdate', (object) ->
  date = moment new Date object
  return new Spacebars.SafeString date.fromNow()

UI.registerHelper 'noteid', (object) ->
  d = new Date object.date
  return new Spacebars.SafeString d.getTime()

UI.registerHelper 'gravatar', (object, size) ->
  if object?.email
    object = object.email

  if typeof size == "object"
    size = 80
  fallback = "blank"
  if object
    fallback = "retro"

  return Gravatar.imageUrl object, { size: size, d: fallback }
