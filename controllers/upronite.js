const client = require("../configs/database");

exports.pronite = async (req, res) => {                              //Pronite function for checking which user is registered for which event for user panel
    try {
        const data = await client.query(`select pronite.pronite_id, pronite_name from pronite inner join pronite_registration on pronite.pronite_id = pronite_registration.pronite_id inner join users on users.id = user_id where email = $1`, [req.email])
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   pronite : info.pronite_name,
                   id : info.pronite_id
                };
            });

            res.status(200).json({
                message: "Pronite passes you bought are :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}