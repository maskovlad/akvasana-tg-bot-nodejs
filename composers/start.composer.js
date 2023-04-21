const {Composer} = require('telegraf')

const composer = new Composer()

composer.command('start', async (ctx) => {
  try {
    ctx.users.push(ctx.from.id)

    await ctx.replyWithHTML(`
👋 Привет, <b>${ctx.from.first_name}</b>!
Введи /help чтобы узнать доступные команды!
    `)
  } catch (e) {
    console.error('cant handle start command', e)
  }
})

composer.command('help', async (ctx) => {
  try {
    await ctx.replyWithHTML(`
/calc - Калькулятор
/pass - Генератор пароля
/stats - Статистика для админов
    `)
  } catch (e) {
    console.error('cant handle help command', e)
  }
})

module.exports = composer