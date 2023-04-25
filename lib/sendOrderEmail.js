"use strict";
const nodemailer = require("nodemailer");

const date = new Date().toLocaleString('uk-UK')

// async..await is not allowed in global scope, must use a wrapper
const sendOrderEmail = async (data) =>{

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    auth: {
      user: "volodamir69@ukr.net",
      pass: "hR0xwhHUXwy25soJ",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Телеграм-бот 👻" <volodamir69@ukr.net>', // sender address
    to: "volodamir69@ukr.net", // list of receivers
    subject: `Замовлення з Телеграму ${date}`, // Subject line
    html: `<p style="font-size:16px;">
      
        Дата: <b>${date}</b><br>
        Район: <b>${data.region}</b><br>
        Адреса: <b>${data.address}</b><br>
        Телефон: <b><a href="tel:${data.phone}">${data.phone}</a></b><br>
        Клієнт?: <b>${data.isClient}</b><br>
        Кількість: <b>${data.qty}</b><br>
        Тара: <b>${data.bottle}</b><br>
        Помпа: <b>${data.bottle}</b><br>
        Сума: <b>${data.total}</b><br>
      
    </p>`,
  });

  console.log("Message sent: %s", info.envelope);
  
}

module.exports = sendOrderEmail;
