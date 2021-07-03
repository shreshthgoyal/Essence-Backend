const client = require("../configs/database");

exports.goodies = async (req, res) => {
    try {
        const data = await client.query(`select goodie_name from goodies inner join goodies_registration on goodies.goodie_id = goodies_registration.goodie_id inner join users on users.id = user_id where email = $1`, [req.email])
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   goodie : info.goodie_name,
                };
            });

            res.status(200).json({
                message: "Goodies you bought are :",
                data: filteredData,
            });
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "Database error here",
        });
    };
}