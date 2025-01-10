const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

// new Email(user,url).sendWelcome();
module.exports = class Email{
   constructor(user,url){
      this.to = user.email;
      this.firstName = user.name.split(' ')[0];
      this.url = url;
      this.from = `Natours <${process.env.EMAIL_FROM}>`;
   }

   newTransport(){
      if(process.env.NODE_ENV === 'production'){
         // sendgrid
         return nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.BREVO_USERNAME, // generated ethereal user
              pass: process.env.BREVO_PASSWORD // generated ethereal password
            }
         });
      }

      return nodemailer.createTransport({
         host : process.env.EMAIL_HOST,
         port : 587,
         auth:{
             user : process.env.EMAIL_USERNAME,
             pass: process.env.EMAIL_PASSWORD
         },
      });
   }

   // send the actual email.
   async send(template,subject){
     // 1) Render HTML based on pug template
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
         firstName: this.firstName,
         url: this.url,
         subject
      });

     // 2) Define email options 
     const mailOptions ={
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
      
   };

   // 3) create a transport and send email
   await this.newTransport().sendMail(mailOptions);

   }

   async sendWelcome(){
      await this.send('welcome','Welcome to the natours family')
   }
   async sendPasswordReset(){
      await this.send('passwordReset','Your password reset tokn  (valid for only 10 minutes')
   }
}
