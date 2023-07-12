var createError = require('http-errors');
const express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileio= require('fs');
var linereader = require('readline');

var app = express();


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
async function processResults(readable) {
  var results = {};
  var firstLineFlag = true;
  for await (const chunk of readable) {
    let lines = chunk.split('\n');
    for(let i=0, max=lines.length; i<max; i++) {
      let line = lines[i];
      if(firstLineFlag || !line) { firstLineFlag = false; } else {
        let parsed = line.split(',');
        let parsed_id = parsed[1];
        let parsed_vote = parsed[2];
        if(results.hasOwnProperty(parsed_id)) {
          results[parsed_id].push(parsed_vote);
        } else {
          results[parsed_id] = [parsed_vote];
        }
      }
    }
    writeResultsToFile(results);
  }
}
function writeResultsToFile(results) {
  fileio.writeFileSync(processed_results_file, 'id,vote1,vote2,etc...\n');
  for (let key in results) {
    if (results.hasOwnProperty(key)) {
      fileio.appendFileSync(processed_results_file, key + ',' + results[key].join(',')+'\n');
    }
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
async function processAndDownload(res) {
  const readable = fileio.createReadStream(
    raw_results_file, {encoding: 'utf8'}
  );
  await processResults(readable);
  res.download(processed_results_file);
}

app.get('/', (req, res) => {
   var randomLink = getRandomLink();
   res.render('index', {video: randomLink, bd_debug: randomLink});
});
app.get('/raw_results', (req, res) => {
  res.download(raw_results_file);
});
app.get('/process', (req, res) => {
  processResults(res);
  res.sendStatus(200);
});
app.get('/results', (req, res) => {
  processAndDownload(res);
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
