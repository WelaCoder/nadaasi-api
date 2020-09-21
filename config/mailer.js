var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "mail.nadaasi.com",
    port: 465,
    secure: true,

    auth: {
        user: 'info@nadaasi.com', // your domain email address
        pass: 'qQk!*DyBMHH)' // your password
    },
    tls: {
        rejectUnauthorized: false
    },


    // true for 465, false for other ports
});
function test() {
    transporter.sendMail({
        from: 'zain.abideen14572@gmail.com',
        to: 'zain.abideen14572@gmail.com',
        text: 'hi there',
        subject: 'email'
    }, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}
module.exports = transporter;





