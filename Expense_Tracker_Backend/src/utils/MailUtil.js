const mailer = require("nodemailer");

const mailSend = async(to,subject,text)=>
{
    const transport = mailer.createTransport({
        service :"gmail",
        auth:{
                user: process.env.SMTP_USER || "patelyash8262@gmail.com",
                 pass: process.env.SMTP_PASS ||"jhxpegblysmxqxkz"         
        }
    });

    const mailOptions ={
        to:to,
        from: process.env.SMTP_USER || "patelyash8262@gmail.com",
        subject:subject,
        html : `<h1>${text}</h1>`
    };
    await transport.sendMail(mailOptions)
};
module.exports = mailSend