const nodemailer = require("nodemailer");

const MailObject = (mailDetails) => {
    var transporter = nodemailer.createTransport('smtp://developer.nanda1%40outlook.com:Welcome@2020@smtp-mail.outlook.com');
    let mailOptions = getMailOptions(mailDetails);

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const getMailOptions = (mailOptions) => {
    let mailOptions = {
        from: 'developer.nanda@outlook.com', // TODO: email sender
        to: mailOptions.toEmail, // TODO: email receiver
        subject: mailOptions.subject,
        //text: 'test'
        html: template.html
    };
    return mailOptions;
}


module.exports = { MailObject };