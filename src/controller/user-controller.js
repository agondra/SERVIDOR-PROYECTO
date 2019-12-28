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
    if (!req.body.email || !req.body.password) {
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
        newUser.startDate = new Date();
        newUser.confirmationEmail = false;
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }

            User.findOne({ email: req.body.email }, (err, user) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.gmailUser,
                    pass: config.gmail
                }
            }
            );
            var mensaje = "<html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>Autorregulacion emocional</title><style type='text/css'> body { margin: 0; padding: 0; min - width: 100 % !important; } .content { width: 100 %; max - width: 600px; }  </style > </head > <body yahoo bgcolor='#f6f8f1'> <table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'> <tr><td><table class='content' align='center' cellpadding='0' cellspacing='0' border='0'> <tr><td> Bienvenido "+req.body.name+" a autorregulación emocional <br/> Sólo te queda un único paso, pincha en este link para verificar tu correo electrónico<br/><a href='https://servidor-proyecto.herokuapp.com/api/confirmation/"+user._id+"'>Confirmar email</a><br/>En el caso de que este email no tenga nada que ver contigo por favor ignóralo.</td> </tr></table> </td></tr> </table> </body></html > ";
            var mailOptions =
            {
                from: 'Autorregulacion emocional <autorregulacionemocional@gmail.com>',
                to: req.body.email,
                subject: 'Verifica tu email en autorregulación emocional',
                html: mensaje
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("ha habido un error", error);
                    res.send(error);
                } else {
                    console.log("todo ok en principio", info.response);
                    res.send(info.response);
                }
            });
        });
            return res.status(201).json(user);
        });
    });
};

exports.confirmation = (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {

        if (err){
            return res.status(200).send("<html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>Autorregulacion emocional</title><style type='text/css'> body { margin: 0; padding: 0; min - width: 100 % !important; } .content { width: 100 %; max - width: 600px; }  </style > </head > <body yahoo bgcolor='#f6f8f1'> <table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'> <tr><td><table class='content' align='center' cellpadding='0' cellspacing='0' border='0'> <tr><td> No hemos podido verificar tu correo electrónico, por favor vuelve a registrarte o ponte en contacto con nuestro equipo en la direccion autorregulacionemocional@gmail.com </td> </tr></table> </td></tr> </table> </body></html > " );
        }
        if (user){
            user.updateOne({confirmationEmail:true},user, function(err, user){
                if(err){
                    console.log("Confirmación erronea");
                    return res.status(400).send(err);
                }else{
                    console.log("confirmación existosa");
                    return res.status(200).send("<html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>Autorregulacion emocional</title><style type='text/css'> body { margin: 0; padding: 0; min - width: 100 % !important; } .content { width: 100 %; max - width: 600px; }  </style > </head > <body yahoo bgcolor='#f6f8f1'> <table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'> <tr><td><table class='content' align='center' cellpadding='0' cellspacing='0' border='0'> <tr><td> Felicidades "+user.name+"<br/>Ya se ha validado tu email con éxito, ya puedes acceder a la app con tu usuario y contraseña, gracias por confiar en nosotros!</td> </tr></table> </td></tr> </table> </body></html > " );
                }
            });
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

        if (!user.confirmationEmail){
            return res.status(400).json({'msg':'The email is not confirmed, please look in the inbox of your email and click on the link we have sent to confirm the email. Thank you'});
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