import nodemailer from "nodemailer";

export const mailSender = async (title,email,body) => {
    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        let result = await transporter.sendMail({
            from : "TrustConsult",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        });
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}