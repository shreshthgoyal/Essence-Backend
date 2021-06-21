const jwt = require("jsonwebtoken");
const client = require("../configs/database");


//Verifying the JSON web token

exports.verify = (req,res,next) => {
    const token = req.cookies;
  
    jwt.verify(token,process.env.SECRET_KEY, (err,decoded)=>{
        if(err)
        {
          console.log(err); 
        }
       console.log(decoded);
        const userEmail = decoded.email;

        client
        .query(`SELECT * FROM users WHERE email = $1;`,[userEmail])
        .then((info) => {
            if (info.rows.length === 0) {
                res.status(400).json({
                  message: "Invalid token",
                });
              } else {
                req.email = userEmail;
                next();
              }
        })
        .catch((err) => {
          console.log(err);
              res.status(500).json({
              message: "Database error occured here",
            });
          });
    });
}