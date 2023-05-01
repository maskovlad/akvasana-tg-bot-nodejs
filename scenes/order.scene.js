const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const prisma = require('../lib/prisma')
const nodemailer = require("nodemailer");

module.exports = orderScene = new WizardScene(
  "order",
  // район
  async (ctx) => {
    console.log('Bot started!!!')
    try {
      ctx.session.regionsData = await prisma.akvasanaRegions.findMany({
        where: { minQty: { not: 0 } },
      });
      const regions = ctx.session.regionsData.map(
        (region) => region.regionName
      );

      ctx.session.orderData = {};
      await ctx.replyWithHTML(
        "<b>Виберіть ваш район</b>",
        Markup.keyboard(regions).oneTime().resize().extra()
      );
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при виборі району", e);
    }
  },
  // адреса
  async (ctx) => {
    try {
      // дані вибраного району
      ctx.session.selectedRegion = ctx.session.regionsData.find(
        (o) => o.regionName === ctx.update.message.text
      );

      ctx.session.orderData.total = ctx.session.selectedRegion?.cost;

      ctx.session.orderData.regionName = ctx.update.message.text;
      await ctx.replyWithHTML(
        `<i>Вартість доставки одного бутля 19,5л до вашого району становить</i> ${ctx.session.selectedRegion.cost}грн. <i>Мінімальний заказ, бутлів - ${ctx.session.selectedRegion.minQty} шт</i>\n<b>Введіть вашу адресу</b>`,
        {
          reply_markup: { remove_keyboard: true },
        }
      );
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при виборі району 2: ", e);
    }
  },
  // телефон
  async (ctx) => {
    try {
      ctx.session.orderData.address = ctx.update.message.text;
      await ctx.replyWithHTML("<b>Введіть ваш телефон</b>");
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при вводі телефону", e);
    }
  },
  // чи клієнт
  async (ctx) => {
    try {
      ctx.session.orderData.phone = ctx.update.message.text;
      await ctx.replyWithHTML(
        "<b>Чи є ви нашим клієнтом?</b>",
        Markup.keyboard([["Так", "Ні"]])
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при виборі клієнт чи ні", e);
    }
  },
  // кількість бутлів
  async (ctx) => {
    try {
      ctx.session.orderData.isClient = ctx.update.message.text;
      await ctx.replyWithHTML(
        `<b>Виберіть кількість бутлів</b>`,
        Markup.keyboard(
          ctx.session.selectedRegion.minQty > 1
            ? [
                ["2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
              ]
            : [
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
              ]
        )
          .oneTime()
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при вводі кількості", e);
    }
  },
  // тара
  async (ctx) => {
    try {
      ctx.session.orderData.qty = +ctx.update.message.text;

      ctx.session.selectedRegion.accessory =
        await prisma.akvasanaAccessory.findMany();

      await ctx.replyWithHTML(
        `💰${(ctx.session.orderData.total =
          ctx.session.orderData.qty *
          ctx.session.orderData.total)}грн<b>\nЧи потрібна вам тара?</b>\n<i>(${
          ctx.session.selectedRegion.accessory[0]?.cost
        } грн/бутель)</i>`,
        Markup.keyboard([["Так", "Ні"]])
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при виборі тари", e);
    }
  },
  // помпа
  async (ctx) => {
    try {
      ctx.session.orderData.bottle = ctx.update.message.text;
      await ctx.replyWithHTML(
        `💰${(ctx.session.orderData.total =
          ctx.session.orderData.total +
          ctx.session.orderData.qty *
            (ctx.session.orderData.bottle === "Так"
              ? ctx.session.selectedRegion.accessory[0]?.cost
              : 0))}грн\n<b>Чи потрібна вам помпа? </b>\n<i>(${
          ctx.session.selectedRegion.accessory[1]?.cost
        }грн/шт)</i>`,
        Markup.keyboard([["Так", "Ні"]])
          .oneTime()
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при виборі помпи", e);
    }
  },
  // підтвердження
  async (ctx) => {
    try {
      ctx.session.orderData.pomp = ctx.update.message.text;
      await ctx.replyWithHTML(
        `💰${(ctx.session.orderData.total =
          ctx.session.orderData.total +
          (ctx.session.orderData.pomp === "Так"
            ? ctx.session.selectedRegion.accessory[1]?.cost
            : 0))}грн\n<b>Підтвердіть замовлення.</b>`,
        Markup.keyboard([["Підтвердити", "Скасувати"]])
          .oneTime()
          .resize()
          .extra()
      );
      ctx.session.orderData.app = "TELEGRAM";

      return ctx.wizard.next();
    } catch (e) {
      console.error("Помилка при підтвердженні", e);
    }
  },
  // відправка
  async (ctx) => {
    try {
      if (ctx.update.message.text === "Скасувати") {
        await ctx.reply(
          `Щоб почати заново натисніть /start`,
          Markup.keyboard(["/start"]).oneTime().resize().extra()
        );
        return ctx.scene.leave();
      }

      console.log({orderData:ctx.session.orderData})

      // addOrderToDB(ctx.session.orderData);
      const sendedOrder = sendOrderEmail(ctx.session.orderData);

      const addedOrder = await prisma.akvasanaOrders.create({
        data: ctx.session.orderData,
      });

      console.log({addedOrder})



      await ctx.reply(
        `Дякуємо за замовлення. Незабаром ми зв\'яжемося з вами. Слава ЗСУ!`
      );
      return ctx.scene.leave();
    } catch (e) {
      console.error("Помилка при роботі з БД або з відправкою email", e);
    }
  }
);

// async..await is not allowed in global scope, must use a wrapper
const sendOrderEmail = async (data) => {
  const date = new Date().toLocaleString("uk-UK");
  console.log({ 'sendOrderEmail data':data });
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    secure: false,
    auth: {
      user: "volodamir69@ukr.net",
      pass: "hR0xwhHUXwy25soJ",
    },
  });
console.log({transporter})
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Телеграм-бот 👻" <volodamir69@ukr.net>', // sender address
    to: data.address !== "test" ? "akvasana@ukr.net" : "volodamir69@ukr.net", // list of receivers
    subject: `Замовлення з Телеграму ${date}`, // Subject line
    html: `<p style="font-size:16px;">
      
        Дата: <b>${date}</b><br>
        Район: <b>${data.regionName}</b><br>
        Адреса: <b>${data.address}</b><br>
        Телефон: <b><a href="tel:${data.phone}">${data.phone}</a></b><br>
        Клієнт?: <b>${data.isClient}</b><br>
        Кількість: <b>${data.qty}</b><br>
        Тара: <b>${data.bottle}</b><br>
        Помпа: <b>${data.bottle}</b><br>
        Сума: <b>${data.total}</b><br>
      
    </p>`,
  },(error)=>console.log({transporterError:error}));

  if (info.messageId) {
     console.log({messageId:info.messageId});
   return {
      statusCode: 200,
      body: nodemailer.getTestMessageUrl(info),
    };
  }
console.log({info});
  return {
    statusCode: 400,
    body: "Oops",
  };
};