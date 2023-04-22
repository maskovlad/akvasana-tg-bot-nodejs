const {Composer} = require('telegraf')

const composer = new Composer()

composer.command('start', async (ctx) => {
  try {
    // ctx.users.push(ctx.from.id)
    await ctx.reply('Замовлення доставки води "Аква Сана Кривий Ріг"')
    await ctx.scene.enter('order')
  } catch (e) {
    console.error('Не вдалося виконати команду start', e)
  }
})

composer.command('help', async (ctx) => {
  try {
    await ctx.replyWithHTML(`
/start - Замовити воду - дайте відповіді на запитання
бота. Зверніть увагу, що вручну необхідно
ввести лише адресу і телефон. Решту відповідей
виберіть за допомогою кнопок. Дякуємо
за Ваш вибір.
    `)
  } catch (e) {
    console.error('Не вдалося виконати команду help', e)
  }
})

module.exports = composer