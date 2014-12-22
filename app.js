var express      = require('express');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var bodyParser   = require('body-parser');
var engine       = require('ejs-locals');
var flash        = require('connect-flash');
var passport     = require('passport');

var app = express();
var router = express.Router();

var redis;
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);

    redis.auth(rtg.auth.split(":")[1]);
}
else {
    // local dev
    redis = require('redis').createClient();
    redis.debug_mode = true;
    redis.flushdb();
}

/***** CONFIGURATION *****/
require('./config/passport')(passport); // passport configuration

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// session setup
app.use(session({
    secret: 'super secret message',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 6000
    },
    store: new RedisStore({
        host: 'localhost',
        port: 6379,
        client: redis
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('connect-flash')({
    host: 'localhost',
    port: 6379,
    app: app 
}) );

app.use(flash());

app.use(function(req, res, next) {
    //res.locals.authMessages = req.flash('auth-message');
    if (res.locals)
        console.log(res.locals.messages);
    next();
})

/***** ROUTES *****/
var index = require('./routes/index');
var api   = require('./routes/api');
var priv  = require('./routes/private');

app.use('/', index);
app.use('/api', api);
app.use('/u', priv);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/***** Export and start in /bin/www *****/
module.exports = app;
