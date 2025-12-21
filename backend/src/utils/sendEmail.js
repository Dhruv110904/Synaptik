const sgMail = require("@sendgrid/mail");

// Set the API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: `"Synaptik" <${process.env.EMAIL_USER}>`, // Must match your Verified Sender in SendGrid
    subject,
    html,
    // Optional: Add a text version for clients that don't view HTML
    // text: html.replace(/<[^>]*>?/gm, ''), 
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent to", to);
  } catch (error) {
    console.error("❌ Email error:", error);

    // SendGrid errors often contain more details in the response body
    if (error.response) {
      console.error("SendGrid Error Body:", error.response.body);
    }
    throw error;
  }
};