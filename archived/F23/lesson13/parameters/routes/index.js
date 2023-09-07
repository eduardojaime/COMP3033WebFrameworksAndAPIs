var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/parametertest', (req, res, next) => {
  var obj = req.body;
  console.log(obj); 

  var items = req.body.customItems;
  console.log(items);
  res.status(200).json({ 'success': 'true' });
});

router.get('/parametertest/:_id/:_value', (req, res, next) => {
  var encoded = req.params._id;
  console.log(encoded);

  var other = req.params._value;
  console.log(other);

  var obj = req.body;
  console.log(obj); 

  var items = req.body.customItems;
  console.log(items);
  res.status(200).json({ 'success': 'true' });
});

module.exports = router;
