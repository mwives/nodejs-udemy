const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'ivo.taskapp@gmail.com',
        templateId: 'd-a1e99b0cd01d4dd1b5f89714f9992433',
        dynamicTemplateData: {
            name
        }
    });
};

const sendCancelationEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'ivo.taskapp@gmail.com',
        templateId: 'd-946e9e609eb242a4b7b7171f3837537e',
        dynamicTemplateData: {
            name
        }
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
};