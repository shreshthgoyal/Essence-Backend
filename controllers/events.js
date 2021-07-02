const client = require("../configs/database");

exports.events = async (req, res) => {
    try {
        const data = await client.query(`SELECT event_id, event_name, date ,users.id, name, college from events inner join testing on event_id = eventid inner join users on users.id = testing.id `)
            const userData = data.rows;
            const filteredData = userData.map((info) => {
                return {
                   event : info.event_name,
                   date : info.date,
                   user : info.name,
                   college : info.college
                };
            });

            res.status(200).json({
                message: "Event Status is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}