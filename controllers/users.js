const client = require("../configs/database");

exports.users = async (req, res) => {                              //Users function to get all the information about users for admin panel
    try {
        const data = await client.query(`SELECT * FROM users WHERE isadmin = false AND verified = true;`)
            const userData = data.rows;
            const filteredData = userData.map((user) => {
                return {
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    contact: user.phonenumber
                };
            });

            res.status(200).json({                               //Sending user information in response
                message: "User Info is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}