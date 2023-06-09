// const prisma = require("./prisma");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addOrderToDB = async (data) => {
  try {
    console.log({ "addOrderToDB data in": data });
    const getOrders = await prisma.akvasanaRegions.findMany();
    console.log({ getOrders });
    const addedOrder = await prisma.akvasanaOrders.create({
      data,
    });
    console.log({ addedOrder });
  } catch (error) {
    console.error("Помилка роботи з БД: ", error);
  }
  console.log({ "addOrderToDB data out": data });
};

module.exports = addOrderToDB;
