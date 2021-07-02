const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.eventUnregister = (req, res) => {
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
           client
           .query(`DELETE FROM testing WHERE id = $1 AND eventid = $2;`, [userid,eventid], (err)=>{
               if(err){
                   console.error(err);
                   res.status(500).json({
                    message: "Database error!",
                  });
               }    
               else{
                res.status(200).json({
                    message : "Unregistered from event!",
                   });
               }
           })
       }).catch((err) => {
        console.log(err);
        res.status(500).json({
        error: "Database error occured here",
         });
        }); 
    });

};