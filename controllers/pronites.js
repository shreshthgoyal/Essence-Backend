const client = require("../configs/database");

exports.pronites = async (req, res) => {                               //Pronite function for checking which user is registered for which pronite for admin panel
    try {
        const data = await client.query(`SELECT name, pronite_name from pronite inner join pronite_registration on pronite.pronite_id = pronite_registration.pronite_id inner join users on users.id = user_id `)
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   pronite : info.pronite_name,
                   fee : info.fee,
                   date : info.date,
                   user : info.name,
                   college : info.college
                };
            });

            res.status(200).json({                                     //Sending Pronite information in response
                message: "Pronite Status is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}
