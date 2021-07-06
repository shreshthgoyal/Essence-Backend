const jwt = require("jsonwebtoken");
const client = require("../configs/database");

//Verifying the JSON web token

exports.verifym = (req,res,next) => {
       const token = req.headers.authorization;              //Took token from headers
       if(!token){
        res.status(401).json({
          error: "User not Signed in, Sign in First.",
        });
       }
       
    jwt.verify(token, process.env.SECRET_KEY, (err,decoded)=>{         //Verify function for JWT
        if(err)
        {
          console.log(err); 
          res.status(400).json({
            error: "User not Signed in, Sign in First.",
          });
        }

        else{
        const userEmail = decoded.email;
        client
        .query(`SELECT * FROM users WHERE email = $1;`,[userEmail])
        .then((info) => {                                         
            if (info.rows.length === 0) {                                     //Checking if user is registered or not
                 res.status(400).json({  
                  error: "User not registered. Register yourself first.",
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
