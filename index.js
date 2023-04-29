const { Telegraf, Stage, session } = require('telegraf')
require('dotenv').config()

const token = process.env.BOT_TOKEN
const bot = new Telegraf(token)

const stage = new Stage([require('./scenes/order.scene')])
bot.use(session())
bot.use(stage.middleware())

bot.use(require('./composers/start.composer'))
bot.use(require('./composers/utils.composer'))

// bot.launch().then(() => {
// 	console.log(`bot started on @${bot.options.username}`)
// })

module.exports = bot;