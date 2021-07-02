const client = require("../configs/database");

exports.pronites = async (req, res) => {
    try {
        const data = await client.query(`SELECT pronite_id, pronite_name, fee, date ,users.id, name, college from pronite inner join testing on pronite_id = proniteid inner join users on users.id = testing.id `)
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

            res.status(200).json({
                message: "Pronite Status is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}