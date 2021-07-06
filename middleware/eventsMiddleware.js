exports.eventIdParam = (req, res, next, id) => {
    
    req.eventid = id;                                           // Requiring ID from URL parameter
    next();
  };