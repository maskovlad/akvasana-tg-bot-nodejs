const { Telegraf, Stage, session } = require('telegraf')
require('dotenv').config()

const token = process.env.BOT_TOKEN
const bot = new Telegraf(token)
const users = []

const stage = new Stage([require('./scenes/calc.scene')])
bot.use(session())
bot.use(stage.middleware())
bot.context.users = users

bot.use(require('./composers/start.composer'))
bot.use(require('./composers/utils.composer'))

bot.launch().then(() => {
	console.log(`bot started on @${bot.options.username}`)
})
