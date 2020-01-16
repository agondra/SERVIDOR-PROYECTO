var express         = require('express'),
    routes          = express.Router();
var userController  = require('./controller/user-controller');
var passport	    = require('passport');
 
routes.get('/', (req, res) => {
    return res.send('Hello, this is the API!');
});
 
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
 
routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
});

routes.get('/confirmation/:id',userController.confirmation);

routes.post('/reset',userController.sendEmailResetPassword);

/*routes.post('/password/reset/:id/:token', passport.authenticate('jwt', { session: false }),userController.receiveNewPassword);
routes.get('/password/reset/:id/:token',passport.authenticate('jwt', { session: false }),userController.receiveNewPassword);
routes.get('/notifications/', passport.authenticate('jwt', { session: false }),userController.sendNotificationPush);
routes.post('/notification/add', passport.authenticate('jwt', { session: false }),userController.receivePushNotification);
routes.post('/notifications/rm',passport.authenticate('jwt', { session: false }), userController.removePushNotification);*/

 
module.exports = routes;
