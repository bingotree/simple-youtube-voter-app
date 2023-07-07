var createError = require('http-errors');
const express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/*
var indexRouter = require('./routes/index');
var voteRouter = require('./routes/vote');
*/

var app = express();


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use('/', indexRouter);
app.use('/vote', voteRouter);

*/
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

var urls = ['https://www.youtube.com/watch?v=ncmCP-mrZ5o',
            'https://www.youtube.com/watch?v=9waAUbErluQ',
            'https://www.youtube.com/watch?v=85BvT5X6WSo',
            'https://www.youtube.com/watch?v=Y9r4G9o2upA', 
            'https://www.youtube.com/watch?v=AyU3D3_Y53Y'];

function randomLinks(seed, hostname) {
  var MersenneTwister = require('mersenne-twister');
  var generator = new MersenneTwister(seed+10000);
  var linkCount = urls.length;
  var links = [];
  for (var i = 0; i < linkCount; i++) {
    links[i] = randomLink(seed + i * 10000, hostname);
  }
  return links;
}

function generateSeed(path) {
  var md5 = require('md5');
  var sum = md5(path);
  var seed = parseInt(sum.slice(0,7),16) + parseInt(sum.slice(8,15),16) + parseInt(sum.slice(16,23),16) + parseInt(sum.slice(24,31),16);
  return seed;
}

function randomVideo(req, res) {
  var seed = generateSeed(req.hostname + req.path);
  var links = randomLinks(seed, req.hostname);
  return links[0];
}




app.get('/', (req, res) => {
   res.render('index', {video: randomVideo()});
});
