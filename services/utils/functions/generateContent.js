const generateContent = (language, username, entryName, entryValue) => {
  let emailContent = "";
  let styles = `  body {
        font-family: Arial, sans-serif;
        color: #333;
      }
      h5, h6 {
        margin: 10px 0;
      }
      p {
        margin: 10px 0;
      }
      .entry-box {
        border: 1px solid #ccc;
        padding: 10px;
        background-color: #f7f7f7;
        border-radius: 5px;
      }
      .thank-you {
        font-weight: bold;
        color: #007bff;
      }`;
  if (language === "gb") {
    emailContent = `
      <html>
      <head>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <p>Hello,</p>
        <p>${username}, using the Check-Pass app, has saved the following information to be shared with you:</p>
        <div class="entry-box">
          <h5>${entryName}</h5>
          <h6>${entryValue}</h6>
        </div>
        <p class="thank-you">Thank you!</p>
      </body>
      </html>
    `;
  } else if (language === "fr") {
    emailContent = `
      <html>
      <head>
        <style>
   ${styles}
        </style>
      </head>
      <body>
        <p>Bonjour,</p>
        <p>${username}, en utilisant l'application Check-Pass, a enregistré les informations suivantes à partager avec vous :</p>
        <div class="entry-box">
          <h5>${entryName}</h5>
          <h6>${entryValue}</h6>
        </div>
        <p class="thank-you">Merci !</p>
      </body>
      </html>
    `;
  } else if (language === "de") {
    emailContent = `
      <html>
      <head>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <p>Hallo,</p>
        <p>${username}, hat über die Check-Pass App die folgenden Informationen gespeichert, um sie mit Ihnen zu teilen:</p>
        <div class="entry-box">
          <h5>${entryName}</h5>
          <h6>${entryValue}</h6>
        </div>
        <p class="thank-you">Vielen Dank!</p>
      </body>
      </html>
    `;
  } else if (language === "tr") {
    emailContent = `
    <html>
  <head>
    <style>
     ${styles}
    </style>
  </head>
  <body>
    <p>Merhaba,</p>
    <p>${username}, Check-Pass uygulamasını kullanarak aşağıdaki bilgileri size iletmek üzere kaydetti:</p>
    <div class="entry-box">
      <h5>${entryName}</h5>
      <h6>${entryValue}</h6>
    </div>
    <p class="thank-you">Teşekkür ederiz!</p>
  </body>
  </html>`;
  }

  return emailContent;
};

module.exports = generateContent;
