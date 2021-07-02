const jwt = require("jsonwebtoken");
const client = require("../configs/database");

//Verification Function
exports.verify = async (req, res) => {
    const { token } = req.params;
    try {

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
            }
            console.log(decoded);
            const email = decoded.email;
            client.query(`SELECT * FROM users WHERE email = $1;`, [email])                    //Checking if user exists or not
                .then((data) => {
                    arr = data.rows;

                    if (arr.length === 0) {
                        res.status(400).json({
                            error: "User not found",
                        });
                    }

                    else {
                        client.query(`UPDATE users SET verified = 'true' WHERE email = $1`,   //set user account as verified
                            [email], (err) => {
                                if (err)
                                    res.status(500).json({
                                        error: "Database error"
                                    })
                            })

                        const token = jwt.sign(                                                  //Signing a jwt token
                            {
                                email: arr[0].email
                            },
                            process.env.SECRET_KEY
                        );

                        res.status(200)
                            .cookie("token", token, {                                            //Assigning token to a cookie
                                // sameSite: 'none', secure: false,
                                expires: new Date(new Date().getTime() + 5 * 10000),
                                httpOnly: true,
                            })
                            .json(
                                {
                                    message: "User added",
                                    cookie_status: "Assigned",
                                    verification_status: "verified",
                                }
                            );
                    }
                })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error occured while verifying user!",                      //Database connection error   
        });
    };
}
