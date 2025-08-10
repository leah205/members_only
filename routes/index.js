var express = require('express');
var router = express.Router();
const controller = require('../controllers/controller')


/* GET home page. */
router.get('/', controller.getIndex);
router.get('/sign-up', controller.getSignUp)
router.post('/sign-up', controller.postSignUp)
router.get('/login', controller.getLogin)
router.post('/login', controller.postLogin)
router.get('/logout', controller.getLogout)
router.get('/membership', controller.isAuth, controller.getMembership)
router.post('/make-member', controller.postMakeMember)
router.post('/delete-member', controller.deleteMember)
router.post('/post-message', controller.postMessage)
router.get('/admin', controller.isAuth,  controller.getAdmin)
router.post('/make-admin', controller.postMakeAdmin)
router.post('/delete-admin', controller.postDeleteAdmin)




module.exports = router;
