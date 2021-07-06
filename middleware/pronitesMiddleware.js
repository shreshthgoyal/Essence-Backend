exports.proniteIdParam = (req, res, next, id) => {
  req.proniteid = id;
  next();
};
