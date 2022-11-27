const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const activitypubExpress = require('activitypub-express');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const routes = {
  actor: '/u/:actor',
  object: '/o/:id',
  activity: '/s/:id',
  inbox: '/u/:actor/inbox',
  outbox: '/u/:actor/outbox',
  followers: '/u/:actor/followers',
  following: '/u/:actor/following',
  liked: '/u/:actor/liked',
  collections: '/u/:actor/c/:id',
  blocked: '/u/:actor/blocked',
  rejections: '/u/:actor/rejections',
  rejected: '/u/:actor/rejected',
  shares: '/s/:id/shares',
  likes: '/s/:id/likes'
};

const apex = activitypubExpress({
  name: "Eventually",
  version: "0.1.0",
  domain: "localhost",
  actorParam: 'actor',
  objectParam: 'id',
  activityParam: 'id',
  routes,
  endpoints: {
    proxyUrl: 'https://localhost/proxy'
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(
  express.json({type: apex.consts.jsonldTypes}),
  express.urlencoded({ extended: true }),
  apex
  );


// ActivityPub standard routes
app.route(routes.inbox)
  .get(apex.net.inbox.get)
  .post(apex.net.inbox.post);
app.route(routes.outbox)
  .get(apex.net.outbox.get)
  .post(apex.net.outbox.post);
app.get(routes.actor, apex.net.actor.get);
app.get(routes.followers, apex.net.followers.get);
app.get(routes.following, apex.net.following.get);
app.get(routes.liked, apex.net.liked.get);
app.get(routes.object, apex.net.object.get);
app.get(routes.activity, apex.net.activityStream.get);
app.get(routes.shares, apex.net.shares.get);
app.get(routes.likes, apex.net.likes.get);
app.get('/.well-known/webfinger', apex.net.webfinger.get);
app.get('/.well-known/nodeinfo', apex.net.nodeInfoLocation.get);
app.get('/nodeinfo/:version', apex.net.nodeInfo.get);
app.post('/proxy', apex.net.proxy.post);

// Custom side-effects

app.on('apex-outbox', ({activity, object, actor}) => {
  if (activity.type === 'Create') {
    console.log(`New ${object.type} from ${actor}`);
  }
});

app.on('apex-inbox', ({activity, object, actor, recipient}) => {
  if (activity.type === 'Create') {
    console.log(`New ${object.type} from ${actor} to ${recipient}`);
  }
});

// Other routes
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
