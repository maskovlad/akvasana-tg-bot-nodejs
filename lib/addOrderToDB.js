const prisma = require("./prisma");

const addOrderToDB = async (data) => {
  console.log({ 'addOrderToDB':data });
  try {
    const addedOrder = await prisma.akvasanaOrders.create({
      data,
    });
    console.log({ addedOrder });
  } catch (error) {
    console.error('Помилка роботи з БД: ', error);
  }
};

module.exports = addOrderToDB;
