exports.goodieIdParam = (req, res, next, id) => {
  req.goodieid = id;
  next();
};
