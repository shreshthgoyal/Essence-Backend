const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.proniteRegister = async (req, res) => {
  const token = req.headers.authorization;
  const userid = req.userid;

  const proniteid = req.proniteid;

  try {
    const data = await client.query(
      `SELECT * FROM pronite_registration WHERE user_id = $1 AND pronite_id = $2;`,
      [userid, proniteid]
    );

    arr = data.rows;

    if (arr.length != 0) {
      res.status(400).json({
        error: "User already registered",
      });
    } else {
      client.query(
        `INSERT INTO pronite_registration (user_id, pronite_id) VALUES ($1, $2);`,
        [userid, proniteid],
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              error: "Database error!",
            });
          } else {
            res.status(200).json({
              message: "Registered for pronite show!",
            });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Database error occured here",
    });
  }
};
