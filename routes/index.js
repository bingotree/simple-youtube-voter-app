var express = require('express');
var router = express.Router();

var urls = ['https://www.youtube.com/watch?v=ncmCP-mrZ5o','youtube.com/watch?v=9waAUbErluQ', 'https://www.youtube.com/watch?v=85BvT5X6WSo', 'https://www.youtube.com/watch?v=Y9r4G9o2upA', 
            https://www.youtube.com/watch?v=AyU3D3_Y53Y'];

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

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
//  res.render('random', {title: 'hiya', paragraphs: 'words', links: links});


}

//router.get('/', randomVideo);
  router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

// console.log(lorem.generateParagraphs(7));

// var paragraphs = [];
// for (var i = 0; i < 7; i++) {
//   paragraphs[i] = lorem.generateParagraphs(1);
// }
//
// var title = lorem.generateSentences(1);

// router.all('*', (req, res) => res.render('random', {title: title, paragraphs: paragraphs} ) )

// router.get('/', (req, res) => res.send(lorem.generateParagraphs(7)))

module.exports = router;
