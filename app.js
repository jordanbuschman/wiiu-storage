var express      = require('express');
var session      = require('express-session');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var engine       = require('ejs-locals');
var flash        = require('connect-flash');
var passport     = require('passport');

var app = express();

/***** ROUTES *****/
var routes = require('./routes.js');
app.use('/', routes);

/***** CONFIGURATION *****/
require('./config/passport')(passport);

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
    secret: 'dont alter pl0x',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
