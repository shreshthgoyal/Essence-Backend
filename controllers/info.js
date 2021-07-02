const client = require("../configs/database");

exports.info = async (req, res) => {
    try {
        const data = await client.query(`SELECT * FROM users WHERE email = '${req.email}'`)
            const userData = data.rows;
            res.status(200).json({
                message: "User Info is :",
                data: userData
            });
    } catch (err) {
        res.status(400).json({
            message: "Database error here"
        });
    };
}
