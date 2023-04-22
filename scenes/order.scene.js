const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");

const regions = ["Покровський", "Тернівський", "Саксаганський"];
const bottleCost = 330;
const pompCost = 150;
const sum = 0

module.exports = orderScene = new WizardScene(
  "order",
  async (ctx) => {
    try {
      await ctx.reply(
        "Виберіть ваш район",
        Markup.keyboard(regions).oneTime().resize().extra()
      );
      ctx.session.orderData = {};
      return ctx.wizard.next();
    } catch {
      console.error("Помилка при виборі району", e);
    }
  },
  async (ctx) => {
    try {
      ctx.session.orderData.region = ctx.update.message.text;
      await ctx.reply("Введіть вашу адресу", {
        reply_markup: { remove_keyboard: true },
      });
      return ctx.wizard.next();
    } catch {}
  },
  async (ctx) => {
    try {
      ctx.session.orderData.adress = ctx.update.message.text;
      await ctx.reply("Введіть ваш телефон");
      return ctx.wizard.next();
    } catch {}
  },

  async (ctx) => {
    try {
      ctx.session.orderData.phone = ctx.update.message.text;
      await ctx.reply(
        "Чи є ви нашим клієнтом?",
        Markup.keyboard([["Так", "Ні"]])
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch {}
  },
  async (ctx) => {
    try {
      ctx.session.orderData.isClient = ctx.update.message.text;
      await ctx.replyWithHTML(
        `Чи потрібна вам тара? (${bottleCost}грн/бутель)`,
        Markup.keyboard([["Так", "Ні"]])
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch {}
  },
  async (ctx) => {
    try {
      ctx.session.orderData.bottle = ctx.update.message.text;
      await ctx.reply(
        `Чи потрібна вам помпа? (${pompCost}грн/шт)`,
        Markup.keyboard([["Так", "Ні"]])
          .oneTime()
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch {}
  },
  async (ctx) => {
    try {
      ctx.session.orderData.pomp = ctx.update.message.text;
      await ctx.reply(
        `Виберіть кількість бутлів`,
        Markup.keyboard([
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
        ])
          .oneTime()
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch {}
  },
  async (ctx) => {
    try {
      ctx.session.orderData.qty = ctx.update.message.text;
      // todo розрахунок вартості
      console.log(ctx.session.orderData);
      await ctx.reply(
        `Сплатити по факту доставки необхідно буде ' . ${sum} . 'грн. Підтвердіть замовлення.`,
        Markup.keyboard([["Підтвердити", "Скасувати"]])
          .oneTime()
          .resize()
          .extra()
      );
      return ctx.wizard.next();
    } catch {}
  },
  async (ctx) => {
    try {
      if (ctx.update.message.text === "Скасувати") {
        await ctx.reply(
          `Щоб почати заново натисніть /start`,
          Markup.keyboard(["/start"]).oneTime().resize().extra()
        );

        return ctx.scene.leave();
      }
      // write to DB & send email
      await ctx.reply(
        `Дякуємо за замовлення. Незабаром ми зв\'яжемося з вами. Слава ЗСУ!`
      );
      return ctx.scene.leave();
    } catch {}
  }
);
