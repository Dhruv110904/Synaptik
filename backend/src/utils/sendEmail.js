const Brevo = require("@getbrevo/brevo");

const client = new Brevo.BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

module.exports = async ({ to, subject, html }) => {
  try {
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Synaptik",
        email: process.env.EMAIL_USER,
      },

      to: [{ email: to }],

      subject,

      htmlContent: html,
    });

    console.log("✅ Email sent:", response);
  } catch (error) {
    console.error("❌ Brevo Error:", error);
  }
};