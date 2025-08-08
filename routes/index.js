var express = require('express');
var router = express.Router();
const controller = require('../controllers/controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/sign-up', controller.getSignUp)
router.post('/sign-up', controller.postSignUp)
router.get('/login', controller.getLogin)
router.post('/login', controller.postLogin)



module.exports = router;
