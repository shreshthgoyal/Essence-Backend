exports.eventIdParam = (req, res, next, id) => {
    
    req.eventid = id;
    next();
  };