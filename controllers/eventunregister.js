const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.eventUnregister = async (req, res) => {                //Unregistering users from events
  const token = req.headers.authorization;            //Required token from header             
  const userid = req.userid;

  const eventid = req.eventid;


  try {
    const data = await client.query(`DELETE FROM event_registration WHERE user_id = $1 AND event_id = $2;`, [userid, eventid], (err) => {   //Deleting userID and eventID row from database for the user
      if (err) {
        console.error(err);
        res.status(500).json({
          error: "Database error!",
        });
      }
      else {
        res.status(200).json({
          message: "Unregistered from event!",
        });
      }
    })
  }
  catch (err) {                            //Handling error if there is any in this function
    console.log(err);
    res.status(500).json({
      error: "Database error occured here",
    });
  };
};