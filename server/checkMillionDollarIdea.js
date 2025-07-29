const checkMillionDollarIdea = (req, res, next) => {
  const { weeklyRevenue, numWeeks } = req.body;
  const totalValue = Number(weeklyRevenue) * Number(numWeeks);

  if (
    !weeklyRevenue ||
    !numWeeks ||
    isNaN(totalValue) ||
    totalValue < 1000000
  ) {
    return res
      .status(400)
      .send({ message: "Idea must be worth at least one million dollars" });
  }
  next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
