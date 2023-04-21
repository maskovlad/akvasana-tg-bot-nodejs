const WizardScene = require('telegraf/scenes/wizard')

module.exports = calcScene = new WizardScene(
  'calc',
  async (ctx) => {
    try {
      await ctx.replyWithHTML(`Введите первое число`)
      return ctx.wizard.next()
    } catch { }
  },
  async (ctx) => {
    try {
      const a = +ctx.message.text
      if (isNaN(a)) return
      ctx.session.a = a

      await ctx.replyWithHTML(`Введите второе число`)
      return ctx.wizard.next()
    } catch { }
  },
  async (ctx) => {
    try {
      const b = +ctx.message.text
      if (isNaN(b)) return

      const { a } = ctx.session
      const res = a + b

      await ctx.replyWithHTML(`Результат: ${a} + ${b} = ${res}`)
      return ctx.scene.leave()
    } catch { }
  }
)

