const prisma = require("./prisma");

const addOrderToDB = async (data) => {
  console.log({ 'addOrderToDB data':data });
  try {
    const getOrders = await prisma.akvasanaRegions.findMany()
    console.log({getOrders})
    const addedOrder = await prisma.akvasanaOrders.create({
      data,
    });
    console.log({ addedOrder });
  } catch (error) {
    console.error('Помилка роботи з БД: ', error);
  }
};

module.exports = addOrderToDB;
