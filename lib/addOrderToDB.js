const prisma = require("./prisma");

const addOrderToDB = async (data) => {
  const addedOrder = await prisma.akvasanaOrders.create({
    data,
  });
  console.log({ addedOrder });
};

module.exports = addOrderToDB;
