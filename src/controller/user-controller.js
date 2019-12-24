var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var nodemailer = require('nodemailer');
 
function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 86400 // 86400 expires in 24 hours
      });
}
 
exports.registerUser = (req, res) => {
    if (!req.body.email || !req.body.password ) {
        return res.status(400).json({ 'msg': 'You need to send email and password' });
    }
 
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
 
        if (user) {
            return res.status(400).json({ 'msg': 'The user already exists' });
        }
        
        let newUser = User(req.body);
        newUser.startDate=new Date();
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(user);
        });
    });
};
 
exports.confirmation= (req,res)=>{
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'autorregulacionemocional@gmail.com',
            pass:'Ordenador3S'
        }
    }
    );

    var mensaje="hola como estás";
    var mailOptions =
    {
        from:'autorregulacionemocional@gmail.com',
        to:'autorregulacionemocional@gmail.com',
        subject:'asunto es ',
        text: mensaje
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(err);
        }else{
            console.log("email enviado : "+info.response)
        }
    });
}


exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ 'msg': 'You need to send email and password' });
    }
 
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!user) {
            return res.status(400).json({ 'msg': 'The user does not exist' });
        }
 
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                });
            } else {
                return res.status(400).json({ msg: 'The email and password don\'t match.' });
            }
        });
    });
};