 const {Composer} = require('telegraf')

 const composer = new Composer()

composer.command('calc', async (ctx) => {
  try {
    await ctx.scene.enter('calc')
  } catch (e) {
    console.error('cant enter calc scene', e)
  }
})


 module.exports = composer