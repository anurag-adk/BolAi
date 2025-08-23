//Import:
import nodemailer from "nodemailer";
//Interface For The Function:
interface mailPayload {
  type: string;
  receiver: string;
  otp?: number;
  name?: string;
}
//Config:
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // secure SMTP
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.NodeMailer_Email, // your Gmail address
    pass: process.env.NodeMailer_Password, // use App Password (not Gmail login password)
  },
});
//Function To Send The Mail
export const sendMail = async (payload: mailPayload) => {
  try {
    let subject, html;
    if (payload.type === "otp") {
      subject = "BolAi Email Verification – Your OTP Code";
      html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
            <h2 style="text-align: center; color: #4f46e5;">Welcome to BolAi 🎉</h2>
            <p style="font-size: 16px;">We’re excited to have you on <strong>BolAi</strong> – your AI Powered Interview Platform.</p>
    
            <p style="font-size: 16px;">To verify your email, please use the One-Time Password (OTP) below:</p>
    
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; letter-spacing: 6px; padding: 12px 24px; border-radius: 8px; background: #f3f4f6; color: #111; font-weight: bold;">
                    ${payload.otp!}
                </span>
            </div>

            <p style="font-size: 15px; color: #555;">⚠️ This OTP will expire in <strong>5 minutes</strong>. Please enter it immediately to complete your verification.</p>

            <p style="font-size: 15px; color: #555;">If you didn’t receive the code or it expired, simply click on <strong>“Didn’t receive the code”</strong> in the app to request a new one.</p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 13px; color: #888; text-align: center;">
                You’re receiving this email because you signed up for BolAi.  
                If this wasn’t you, please ignore this email.
            </p>
        </div>
        `;
    } else if (payload.type === "verified") {
      subject = "🎉 Welcome to BolAi – Your AI Interview Partner!";
      html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
            <h2 style="text-align: center; color: #4f46e5;">
                Welcome aboard, ${payload.name! || "there"} 👋
            </h2>

            <p style="font-size: 16px;">
                Your email has been <strong>successfully verified</strong> – you’re now officially part of <strong>BolAi</strong>, an AI Powered Interview Platform built to help you shine in your career journey.
            </p>
    
            <h3 style="color: #111; margin-top: 20px;">🚀 What you can do with BolAi:</h3>
            <ul style="font-size: 15px; line-height: 1.6; color: #555;">
                <li><strong>Practice Mock Interviews</strong> with our AI to simulate real-world interview scenarios.</li>
                <li><strong>Get Personalized Suggestions</strong> on how to improve your responses, communication, and confidence.</li>
                <li><strong>Boost Your Chances</strong> of landing your dream job by being better prepared and interview-ready.</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://bolai.vercel.app/login" 
                style="background: #4f46e5; color: #fff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                    Start Your Journey
                </a>
            </div>

            <p style="font-size: 14px; color: #666;">
                We’re excited to see how BolAi can help you grow.  
                Remember, the more you practice, the more confident you’ll become.
            </p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 13px; color: #888; text-align: center;">
                Thank you for trusting BolAi. Let’s prepare, improve, and achieve – together. 💼✨
            </p>
        </div>
      `;
    }
    const info = await transporter.sendMail({
      from: '"BolAi 🔊" <bolai.interview@gmail.com>',
      to: payload.receiver,
      subject,
      html, // HTML body
    });
    console.log("Message sent:", info.messageId);
    return {
      success: true,
      message: "Successfully Sent The Email!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Server Failed To Send The Mail",
    };
  }
};
