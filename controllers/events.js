const client = require("../configs/database");

exports.events = async (req, res) => {    //Events function for checking which user is registered for which event for admin panel
    try {
        const data = await client.query(`SELECT name, event_name from events inner join event_registration on events.event_id = event_registration.event_id inner join users on users.id = user_id `)
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   event : info.event_name,
                   date : info.date,
                   user : info.name,
                   college : info.college
                };
            });

            res.status(200).json({                                    //Sending data in response
                message: "Event Status is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}
