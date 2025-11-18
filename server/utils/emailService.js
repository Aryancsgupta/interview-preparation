// // server/utils/emailService.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// // Create transporter for sending emails
// const createTransporter = () => {
//   // For Gmail, you can use OAuth2 or App Password
//   // For development, you can use Ethereal Email (https://ethereal.email)
  
//   // Option 1: Gmail with App Password (Recommended for production)
//   if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST || "smtp.gmail.com",
//       port: process.env.EMAIL_PORT || 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // App Password for Gmail
//       },
//     });
//   }
  
//   // Option 2: Ethereal Email (for testing/development)
//   // This creates a test account automatically
//   return nodemailer.createTransporter({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: process.env.ETHEREAL_USER || "ethereal.user@ethereal.email",
//       pass: process.env.ETHEREAL_PASS || "ethereal.pass",
//     },
//   });
// };

// // Send email function
// export const sendEmail = async (to, subject, html, text = "") => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@aiinterview.com",
//       to: to,
//       subject: subject,
//       html: html,
//       text: text || html.replace(/<[^>]*>/g, ""), // Plain text version
//     };

//     const info = await transporter.sendMail(mailOptions);
    
//     console.log("✅ Email sent successfully:", info.messageId);
    
//     // For Ethereal Email, log the preview URL
//     if (info.messageId && info.response.includes("ethereal")) {
//       console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
//     }
    
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error("❌ Email sending error:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Send feedback email to admin
// export const sendFeedbackEmail = async (userEmail, userName, feedback) => {
//   const adminEmail = process.env.ADMIN_EMAIL || "aryangupta1467@gmail.com";
  
//   const subject = `New Feedback from ${userName || "User"}`;
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #2563eb;">New Feedback Received</h2>
//       <div style="background: #f6f9fc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <p><strong>From:</strong> ${userName || "Anonymous"} (${userEmail || "No email"})</p>
//         <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//       </div>
//       <div style="background: white; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
//         <h3 style="color: #1f2937; margin-top: 0;">Feedback:</h3>
//         <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${feedback}</p>
//       </div>
//     </div>
//   `;
  
//   return await sendEmail(adminEmail, subject, html);
// };

// // Send question suggestion email to admin
// export const sendQuestionSuggestionEmail = async (userEmail, userName, questionData) => {
//   const adminEmail = process.env.ADMIN_EMAIL || "aryangupta1467@gmail.com";
  
//   const subject = `New Question Suggestion from ${userName || "User"}`;
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #059669;">New Question Suggestion</h2>
//       <div style="background: #f6f9fc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <p><strong>From:</strong> ${userName || "Anonymous"} (${userEmail || "No email"})</p>
//         <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//       </div>
//       <div style="background: white; padding: 20px; border-left: 4px solid #059669; margin: 20px 0;">
//         <h3 style="color: #1f2937; margin-top: 0;">Question Details:</h3>
//         <p><strong>Question:</strong></p>
//         <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap; background: #f9fafb; padding: 10px; border-radius: 4px;">${questionData.question}</p>
        
//         ${questionData.category ? `<p><strong>Category:</strong> ${questionData.category}</p>` : ""}
//         ${questionData.difficulty ? `<p><strong>Difficulty:</strong> ${questionData.difficulty}</p>` : ""}
//         ${questionData.type ? `<p><strong>Type:</strong> ${questionData.type}</p>` : ""}
        
//         ${questionData.options && questionData.options.length > 0 ? `
//           <p><strong>Options:</strong></p>
//           <ul style="color: #4b5563;">
//             ${questionData.options.map((opt, idx) => `<li>${opt}${idx === questionData.correctOptionIndex ? ' <strong style="color: #059669;">(Correct)</strong>' : ''}</li>`).join("")}
//           </ul>
//         ` : ""}
        
//         ${questionData.correctAnswer ? `
//           <p><strong>Correct Answer:</strong></p>
//           <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap; background: #f9fafb; padding: 10px; border-radius: 4px;">${questionData.correctAnswer}</p>
//         ` : ""}
        
//         ${questionData.additionalNotes ? `
//           <p><strong>Additional Notes:</strong></p>
//           <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${questionData.additionalNotes}</p>
//         ` : ""}
//       </div>
//     </div>
//   `;
  
//   return await sendEmail(adminEmail, subject, html);
// };

// server/utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter for sending emails
const createTransporter = () => {
  // Gmail / custom SMTP (Production)
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Ethereal (Development)
  console.log("ℹ️ Using Ethereal test email account");

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER || "ethereal_user@test.com",
      pass: process.env.ETHEREAL_PASS || "ethereal_pass",
    },
  });
};

// Send Email
export const sendEmail = async (to, subject, html, text = "") => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@aiinterview.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);

    // For Ethereal preview
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 Preview URL:", previewUrl);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    return { success: false, error: error.message };
  }
};


// Send feedback email to admin
export const sendFeedbackEmail = async (userEmail, userName, feedback) => {
  const adminEmail = process.env.ADMIN_EMAIL || "aryangupta1467@gmail.com";

  const subject = `New Feedback from ${userName || "User"}`;
  const html = `
    <h2>New Feedback Received</h2>
    <p><b>User:</b> ${userName} (${userEmail})</p>
    <p><b>Feedback:</b></p>
    <p>${feedback}</p>
  `;

  return await sendEmail(adminEmail, subject, html);
};


// Send question suggestion email to admin
export const sendQuestionSuggestionEmail = async (email, name, questionData) => {
  const adminEmail = process.env.ADMIN_EMAIL || "aryangupta1467@gmail.com";

  const subject = `New Question Suggestion from ${name}`;
  const html = `
    <h2>Question Suggestion</h2>
    <p><b>User:</b> ${name} (${email})</p>
    <p><b>Question:</b> ${questionData.question}</p>
    <p><b>Category:</b> ${questionData.category}</p>
    <p><b>Difficulty:</b> ${questionData.difficulty}</p>
    <p><b>Type:</b> ${questionData.type}</p>

    ${
      questionData.options?.length
        ? `<p><b>Options:</b></p>
           <ul>${questionData.options
             .map(
               (opt, i) =>
                 `<li>${opt}${
                   i === questionData.correctOptionIndex ? " (Correct)" : ""
                 }</li>`
             )
             .join("")}</ul>`
        : ""
    }

    ${
      questionData.correctAnswer
        ? `<p><b>Correct Answer:</b> ${questionData.correctAnswer}</p>`
        : ""
    }
  `;

  return await sendEmail(adminEmail, subject, html);
};
