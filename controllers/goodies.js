const client = require("../configs/database");

exports.goodies = async (req, res) => {
    try {
        const data = await client.query(`SELECT goodie_id, goodie_name, price, users.id, name, college from goodies inner join testing on goodie_id = goodieid inner join users on users.id = testing.id `)
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