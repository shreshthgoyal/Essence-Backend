exports.goodieIdParam = (req, res, next, id) => {
  req.goodieid = id;                           // Requiring ID from URL parameter
  next();
};
