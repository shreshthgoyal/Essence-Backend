//Required all the modules
const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.proniteUnregister = async (req, res) => {         //Unregistring from pronites
  const token = req.headers.authorization;               //Required token from header
  const userid = req.userid;

  const proniteid = req.proniteid;

  try {
    const data = await client.query(
      `SELECT * FROM pronite_registration WHERE user_id = $1 AND pronite_id = $2;`,
      [userid, proniteid]
    );

    arr = data.rows;

    if (arr.length === 0) {
      res.status(400).json({
        error: "User is not registered for the show",
      });
    } else {
    client.query(                                       //Deleting userID and proniteID row from database for the user
      `DELETE FROM pronite_registration WHERE user_id = $1 AND pronite_id = $2;`,
      [userid, proniteid],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            message: "Database error!",
          });
        } else {
          res.status(200).json({
            message: "Unregistered from pronite show!",
          });
        }
      }
    );
  } } catch (err) {                           //Handling error if there is any in this function
    console.log(err);
    res.status(500).json({
      error: "Database error occured here",
    });
  }
};
