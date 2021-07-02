const client = require("../configs/database");

exports.info = async (req, res) => {
    try {
        const data = await client.query(`SELECT * FROM users WHERE email = '${req.email}'`)
            const userData = data.rows;
        console.log(userData)
            const filteredData = userData.map((user) => {
                return {
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    contact: user.phonenumber
                };
            });

            res.status(200).json({
                message: "User Info is :",
                data: filteredData,
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here",
        });
    };
}
