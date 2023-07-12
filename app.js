var createError = require('http-errors');
const express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileio= require('fs');
var linereader = require('readline');
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


// catch 404 and forward to error handler
/*
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
var raw_results_file = "./raw_results.csv";
var processed_results_file = "./results.csv";
function saveAsCSV(id, vote) {
  var csv = Date.now() + ',' + id + ',' + vote + '\n';
  try {
    fileio.appendFileSync(raw_results_file, csv);
  } catch (err) {
    console.log(err);
  }
}
function processResults() {
  fileio.writeFileSync(processed_results_file, 'id,vote1,vote2,etc...\n');
  var fileStream = fileio.createReadStream(raw_results_file);
  var rl = linereader.createInterface({
      input: fileStream,
      crlfDelay: Infinity
  });
  var results = {};
  var firstLineFlag = true;
  rl.on('line', (line) => {
    if(firstLineFlag) { firstLineFlag = false; } else {
      let parsed = line.split(',');
      let parsed_id = parsed[1];
      let parsed_vote = parsed[2];
      if(results.hasOwnProperty(parsed_id)) {
        results[parsed_id].push(parsed_vote);
      } else {
        results[parsed_id] = [parsed_vote];
      }
      console.log(results);
    }
  });
  rl.on('close', () => {
    for (let key in results) {
      if (results.hasOwnProperty(key)) {
        fileio.appendFileSync(processed_results_file, key + ',' + results[key].join(',')+'\n');
      }
    }
  });
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
app.get('/raw_results', (req, res) => {
  res.download(raw_results_file);
});
app.get('/process', (req, res) => {
  processResults();
  res.sendStatus(200);
});
app.get('/results', (req, res) => {
  processResults();
  res.download(processed_results_file);
});
app.get('/clear', (req, res) => {
  fileio.writeFileSync(raw_results_file, 'timestamp,id,vote\n');
  res.sendStatus(200);
});
app.put('/vote', (req, res) => {
  console.log(req.query);
  saveAsCSV(req.query.id, req.query.vote);
  res.sendStatus(200);
});
