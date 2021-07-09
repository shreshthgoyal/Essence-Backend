const client = require("../configs/database");

exports.info = async (req, res) => {                        //Info function for checking info about user for user panel
    try {
        const data = await client.query(`SELECT * FROM users WHERE email = $1;`, [req.email])
            const userData = data.rows;
            const filteredData = userData.map((user) => {
                return {
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    contact: user.phonenumber
                };
            });

            res.status(200).json({                          //Sending user information of user
                message: "User Info is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}
