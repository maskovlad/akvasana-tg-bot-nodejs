const bot = require('../../../index')

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  console.log({"Запрос Телеграму: ":event.body.message?.text})
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: "",
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
