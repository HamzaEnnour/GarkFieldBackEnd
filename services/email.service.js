const nodemailer = require('nodemailer');
const path = require('path');
const User = require('../models/user.model');
const creds = require('../config/config');
const ejs = require('ejs');

const auth = {
    user: "garktn.assistance@gmail.com",
    pass: "Gark2021"
};
/*console.log("auth", auth)*/
/*const transport = {
    host: 'smtp.gmail.com',
    auth
}*/

//Creating a Nodemailer Transport instance
//var transporter = nodemailer.createTransport(transport)

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "garktn.assistance@gmail.com",
        pass: "Gark2021"
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

module.exports = {
    sendActivationLink: async(user, url) => {
        ejs.renderFile(__dirname + "/../mail/activation.ejs", { name: user.email, link: url }, (err, data) => {
            if (err) {
                console.log("error rendering ejs file", err);
                return { Error: "E1" };
            }
            const mailOptions = {
                from: "no_reply@gark.tn",
                to: user.email,
                subject: "Activation de Compte",
                html: data
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log("error sending email", err);
                    return { Error: "E2" };
                }
                return { Message: "sent", info };
            });
        })
    },
    sendResetPasswordLink: async(user, url, clb) => {
        const fullName = `${user.profile.firstName} ${user.profile.lastName}`;
        ejs.renderFile(__dirname + "/../mail/resetPassword.ejs", { name: fullName, link: url }, (err, data) => {
            if (err) {
                console.log("error rendering ejs file", err);
                 clb({ Error: "Internal Error" })
            }else{
                const mailOptions = {
                    from: "no_reply@gark.tn",
                    to: user.email,
                    subject: "Réinitialiser votre mot de passe",
                    html: data
                };
    
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        clb({Error : "Error sending the email"})
                    }else{
                        return clb({ Message: "sent", info });
                    }
                    
                });
            }
            
        })
    }
}