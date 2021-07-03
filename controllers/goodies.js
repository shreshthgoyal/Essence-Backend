const client = require("../configs/database");

exports.goodies = async (req, res) => {
    try {
        const data = await client.query(`SELECT name, goodie_name from goodies inner join goodies_registration on goodies.goodie_id = goodies_registration.goodie_id inner join users on users.id = user_id `)
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   goodie : info.goodie_name,
                   price : info.price,
                   user : info.name,
                   college : info.college
                };
            });

            res.status(200).json({
                message: "Goodies Status is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}
