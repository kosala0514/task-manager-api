const sgMail = require('@sendgrid/mail')
// const sendgridAPIKey = ''
// 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

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'kosalacharuni@gmail.com',
//     from:'kosalacharuni@gmail.com',
//     subject: 'This is my first creation',
//     text: 'I hope you will be ok!'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'kosalacharuni@gmail.com',
        subject: 'Thanks for Joining',
        text: `Welcome to Task App, ${name}. Let me take a tour!`,
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'kosalacharuni@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope you will be back!`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}