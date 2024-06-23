import pkg from "twilio";

const { Twilio } = pkg;
const client = new Twilio(
  process.env.TWILIO_ACCOUNT_ID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = async (phoneno) => {
  try {
    const msg = await client.verify.v2
      .services(process.env.TWILIO_SID)
      .verifications.create({
        to: `+91${phoneno}`,
        channel: "sms",
      });
    return { success: true, msg };
  } catch (error) {
    console.log("Error sending otp: ", error);
    return { success: false, error: error };
  }
};

const verifyOtp = async (phoneno, otp) => {
  try {
    const verficationcheck = await client.verify.v2
      .services(process.env.TWILIO_SID)
      .verificationChecks.create({ to: `+91${phoneno}`, code: otp });
    return { success: true, verficationcheck };
  } catch (error) {
    console.log("Error Verifying otp: ", error);
    return { success: false, error: error };
  }
};

export { sendOtp, verifyOtp };
