var express = require('express');
var router = express.Router();

/* POST vote */
router.vote('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
