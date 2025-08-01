'use server'
import jwt from 'jsonwebtoken'

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_APIKEY, domain: process.env.MAILGUN_DOMAIN })

function generateEmailVerificationToken({email, token_for}){
    return jwt.sign({ email:email, for:token_for }, process.env.AUTH_SECRET, { expiresIn: '1h' });
}

export async function sendEmailVerificationMail(user) {
    let url = `${process.env.APP_URL}/verify_email?token=`+generateEmailVerificationToken({email:user.email, token_for:'verify_email'})
    const mailOptions = {
        from: 'Cashflowy <no-reply@cashflowy.io>',
        to: user.email, // Recipient address
        subject: 'Verify your email to start using Cashflowy', // Subject line
        html: `
            <div style="max-width: 600px; padding: 17px; border: 1px solid #ddd; border-radius: 5px;">
                <p style="font-size: 16px; color: #333; text-align: left; margin-top:0px;">Hi ${user.name},</p>
                <p style="font-size: 14px; color: #555; text-align: left;">Please verify your email address for your Cashflowy account by clicking the button below:</p>
                <a href=${url} style="display: inline-block; background-color: #00b5ad; padding: 10px 20px; font-size: 16px; text-decoration: none; color: white; border-radius: 5px;"><strong>Verify Email Address</strong></a>			
            </div>
        ` 
    };
    try {
        const response = await mailgun.messages().send(mailOptions);
        console.log('Email sent:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}