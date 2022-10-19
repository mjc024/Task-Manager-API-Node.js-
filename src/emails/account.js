const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_Key)
const sendWelcomeMail= (email,name)=>{
    sgMail.send(    
    {
        to: email,
        from: 'mujtabajawed20@gmail.com',
        subject:'Tired',
        text: `Welcome to app ${name}. Let me know `

    }
)
}

const sendCancelMail= (email,name)=>{
    sgMail.send({
        to: email,
        from: 'mujtabajawed20@gmail.com',
        subject:'Account removed',
        text: `Time to say goodbye to app ${name}. Let me know if I could have done anything to keep you `
    }) 
}
module.exports={
    sendWelcomeMail,
    sendCancelMail
}