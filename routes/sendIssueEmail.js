const crypto = require("crypto");
const otpStore = new Map(); // ✅ Temporary store for OTP verification

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

const sendOTPEmail = async (email, otp) => {
  if (!email) {
    console.error("⚠️ No recipient email provided, skipping OTP email.");
    return;
  }

  try {
    const msg = {
      to: email,
      from: { email: process.env.SENDER_EMAIL, name: "Library Admin" },
      subject: "🔐 Library Book Issue OTP Verification",
      text: `Your OTP for book issue is: ${otp}.\n\nIt is valid for 10 minutes.`,
    };

    await sgMail.send(msg);
    console.log("📨 OTP Email Sent Successfully!");
  } catch (error) {
    console.error("⚠️ Error Sending OTP Email: ", error.response ? error.response.body : error);
  }
};
