exports.proniteIdParam = (req, res, next, id) => {
  req.proniteid = id;                                  // Requiring ID from URL parameter
  next();
};
