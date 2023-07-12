var createError = require('http-errors');
const express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileio= require('fs');
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
*/
function saveAsCSV(id, vote) {
  var csv = Date.now() + ',' + id + ',' + vote + '\n';
  try {
    fileio.appendFileSync("./results.csv", csv);
  } catch (err) {
    console.log(err);
  }
}
module.exports = app;

var urls = ['ncmCP-mrZ5o',
            '9waAUbErluQ',
            '85BvT5X6WSo',
            'Y9r4G9o2upA', 
            'AyU3D3_Y53Y'];
var linkCount = urls.length;
function getRandomLink() {
  return urls[Math.floor(Math.random() * linkCount)]
}

app.get('/', (req, res) => {
   var randomLink = getRandomLink();
   res.render('index', {video: randomLink, bd_debug: randomLink});
});
app.get('/results', (req, res) => {
  res.download('./results.csv');
});
app.get('/clear', (req, res) => {
  fileio.writeFileSync('./results.csv', 'timestamp,id,vote\n');
  res.sendStatus(200);
});
app.put('/vote', (req, res) => {
  console.log(req.query);
  saveAsCSV(req.query.id, req.query.vote);
  res.sendStatus(200);
});
