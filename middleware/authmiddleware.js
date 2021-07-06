const jwt = require("jsonwebtoken");
const client = require("../configs/database");

//Verifying the JSON web token

exports.verifym = (req,res,next) => {
       const token = req.headers.authorization;
       if(!token){
        res.status(401).json({
          error: "Invalid token! Please signin/signup first.",
        });
       }
       
    jwt.verify(token, process.env.SECRET_KEY, (err,decoded)=>{
        if(err)
        {
          console.log(err); 
          res.status(400).json({
            error: "Invalid token",
          });
        }

        else{
        const userEmail = decoded.email;
        client
        .query(`SELECT * FROM users WHERE email = $1;`,[userEmail])
        .then((info) => {
            if (info.rows.length === 0) {
                 res.status(400).json({
                  error: "Invalid token",
                });
              } else {
                req.email = userEmail;
                req.userid = info.rows[0].id;
                next();
              }
        })
        .catch((err) => {
          console.log(err);
              res.status(500).json({
              error: "Database error occured here",
            });
          });
        }
    });
}
