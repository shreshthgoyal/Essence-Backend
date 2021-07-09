const client = require("../configs/database");

exports.event = async (req, res) => {                               //Event funciton for checking which user is registered for which event for user panel
    try {  
        const data = await client.query(`select event_name from events inner join event_registration on events.event_id = event_registration.event_id inner join users on users.id = user_id where email = $1`, [req.email])
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   event : info.event_name,
                };
            });

            res.status(200).json({                            //Sending Information of user and events in response
                message: "Events you registered to are :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}