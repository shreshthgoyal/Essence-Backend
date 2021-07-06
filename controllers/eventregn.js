const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.eventRegister = async (req, res) => {       //eventRegister function to register users for an event
  const token = req.headers.authorization;                 //Required token from header
  const userid = req.userid;

  const eventid = req.eventid;
  try {
    const data = await client.query(`SELECT * FROM event_registration WHERE user_id = $1 AND event_id = $2;`, [userid, eventid])                    //Checking if user has already registered for event 

    arr = data.rows;

    if (arr.length != 0) {
      res.status(400).json({
        error: "User already registered",
      });
    }

    else {
      client
        .query(`INSERT INTO event_registration (user_id, event_id) VALUES ($1, $2);`, [userid, eventid], (err) => {   //Inserting User ID and Event ID in event_registration table
          if (err) {
            res.status(500).json({
              error: "Database error!"
            });
          }
          else {
            res.status(200).json({
              message: "Registered for event!"
            });
          }
        })
    }
  }
  catch (err) {                                                 //Error Handling if there is any in this function
    console.log(err);
    res.status(500).json({
      error: "Database error occured here",
    });
  };




};