const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false }
});
const emails_details={
    "reset": {
      url:"http://127.0.0.1:3000/reset_pass.html",
      subject:'reset',
      text:"Click this link to reset your Password"
  
  }
    ,"verification": {
    url:"http://127.0.0.1:3000/user_verification.html",
    subject:'verification',
    text:"Click this link to verify your account"}
  }
  async function send_reset_email(email,token,type){
      let email_data=emails_details[type]
      const resetLink = `${email_data.url}?token=${token}`;
  
      await transporter.sendMail({
        from: `"ecommerce_app" <weslatia20@gmail>`,  
        to: email,
        subject: email_data.subject,
        text: `${email_data.text}: 
        ${resetLink}`,
      });
  }


module.exports = { send_reset_email };



