const nodemailer = require("nodemailer");
const generateContent = require("./generateContent");
const generateSubject = require("./generateSubject");

const sendEmail = async (
  username,
  receiverEmail,
  entryName,
  entryValue,
  language
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const emailContent = generateContent(
      language,
      username,
      entryName,
      entryValue
    );
    const languageSubject = generateSubject(language);
    console.log(languageSubject);
    const info = await transporter.sendMail({
      from: "apicookbook@gmail.com",
      to: receiverEmail,
      subject: languageSubject,
      html: emailContent,
    });

    console.log(info.response);
  } catch (error) {
    handleAndLogError("sendMail", error, (res = null));
  }
};

module.exports = sendEmail;
