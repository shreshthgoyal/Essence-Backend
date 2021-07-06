const client = require("../configs/database");
const jwt = require("jsonwebtoken");

exports.goodiePurchase = async (req, res) => {
  const token = req.headers.authorization;
  const userid = req.userid;

  const goodieid = req.goodieid;

  try {
    const data = await client
      .query(
        `SELECT * FROM goodies_registration WHERE user_id = $1 AND goodie_id = $2;`,
        [userid, goodieid]
      )
      .then((data) => {
        client.query(
          `INSERT INTO goodies_registration (user_id, goodie_id) VALUES ($1, $2);`,
          [userid, goodieid],
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                error: "Database error!",
              });
            } else {
              res.status(200).json({
                message: "Goodie purchase successful!",
              });
            }
          }
        );
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Database error occured here",
    });
  }
};
