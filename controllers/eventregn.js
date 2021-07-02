const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.eventRegister =  (req,res) => {
    const token = req.cookies.token;
    var userid;
    
    const eventid = req.eventid;
    
    jwt.verify(token,process.env.SECRET_KEY, (err,decoded)=>{
        if(err)
        {
          console.log(err); 
        }
       

       const userEmail = decoded.email;

       client
       .query(`SELECT id FROM users WHERE email = $1;`, [userEmail])
       .then((info) => {
           if(info.rows.length === 0){
            res.status(400).json({
                message: "Invalid token",
              });
           }else{
              userid = info.rows[0].id;
           }

           
       }).then(() => {

        
        client.query(`SELECT * FROM testing WHERE id = ${userid} AND eventid = ${eventid};`)                    //Checking if user has already registered for event 
                .then((data) => {
                    arr = data.rows;

                    if (arr.length != 0) {
                        res.status(400).json({
                            error: "User already registered",
                        });
                    }

                    else {
                      client
                          .query(`INSERT INTO testing (id, eventid) VALUES (${userid}, ${eventid});`, (err) => {
                            if(err){
                              console.error(err);
                              res.status(500).json({
                                error: "Database error!"
                              });
                            }
                            else{
                              res.status(200).json({
                                 message : "Registered for event!"
                                });
                            }
                          })
                    }
                })
            
       })
       .catch((err) => {
        console.log(err);
            res.status(500).json({
            message: "Database error occured here",
          });
        }); 
    });

    

};