const generateSubject = (language) => {
  let subject = "";
  if (language === "gb") {
    subject = "Check Pass Message Information";
  } else if (language === "de") {
    subject = "Check Pass Nachrichteninformation";
  } else if (language === "fr") {
    subject = "Informations du Message Check Pass";
  } else if (language === "tr") {
    subject = "Check Pass İleti Bilgileri";
  }
  return subject;
};
module.exports = generateSubject;
