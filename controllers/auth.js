const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/database");
const nodemailer = require("nodemailer");
const passwordValidator = require('password-validator');

const otp = Math.floor(Math.random() * 9000) + 1000;          //Randomly generated string

//Registration Function
exports.register = (req, res) => {
    const { name, email, college, phonenumber, password } = req.body;

    //Email Body
    function createEmailTemplate(req) {
        const htmlTemplate = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <br>
        <td class="container">
          <div class="content" style="text-align:center">
            <table role="presentation" class="main">
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="font-family: Monospace, Times, serif">
                    <tr>
                      <td>
                       <p>Welcome astronaut, jumping from planets to galaxies,
                       busting aliens, warping through wormholes or grabbing that galactic burger 
                       you sure had a rough day! </p>
                       <hr>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td align="left">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p style="font-size: large;">But aliens have snuck in .·¯~(>▂<)~¯·.  to pass through you </p>
                        <br>
                            <h6 style="text-align:center;font-family: Helvetica, sans-serif;">
                            <a href="https://localhost:5000/user/verify/${otp}/${email}"><button>You must verify your identity!</button></a>
                            </h6>
                            <p style="font-size: large;"> to gain access to the spaceship and prepare for another day of space-faring.<br><br>
                            </p><p>May the stars be with you!✨</p>
                            <hr><hr>
                        <br>
                        <p style="text-align:center">🚀🚀🚀</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
        `
        return htmlTemplate
    }   

    client
        .query(`SELECT * FROM users WHERE email= $1;`, [email])                        //Checking if user already exists
        .then((data) => {
            const isValid = data.rows;

            if (isValid.length != 0) {
                res.status(400).json({
                    error: "User already exists",
                });
            }
            else {

                var schema = new passwordValidator();                // Validating Password conditions
                schema
                    .is().min(8)                                    // Minimum length 8
                    .is().max(100)                                  // Maximum length 100
                    .has().uppercase()                              // Must have uppercase letters
                    .has().lowercase()                              // Must have lowercase letters
                    .has().digits(2)                                // Must have at least 2 digits
                    .has().not().spaces()                           // Should not have spaces
                
                if(!schema.validate(password)) {
                    res.status(500).json({
                        error: "Input a Strong Password of minimum 8 characters consisting of upper and lowercase letters and atleast 2 digits."
                    })
                }

              else{
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err)
                        res.status(err).json({
                            error: "Server error",
                        });

                    const user = {
                        id: otp,
                        name,
                        email,
                        college,
                        phonenumber,
                        password: hash,
                    };

                    const emailTemplate = createEmailTemplate(req)

                    var messageToSend = {                                                      //Sending a Verification mail to the user
                        from: "essence21webkriti@gmail.com",  //Add your email here
                        to: user.email,                       //Add the email to whom you wish to send
                        subject: 'Verify Account',            
                        html: emailTemplate
                    }

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'essence21webkriti@gmail.com',      //Add your email here
                            pass: process.env.MAIL_PASS               //Add your password here
                        }
                    })

                    transporter.sendMail(messageToSend, (err, info) => {
                        if (err)
                            res.status(421).send({ message: 'Invalid Email address provided!' })
                        else {
                            users.push({
                                email: email,
                                password: password
                            })
                            res.status(200).send({ message: 'An email sent to your account to verify your identity' })
                        }
                    })


                    //Inserting data into the database

                    client
                        .query(`INSERT INTO users (verified, id, name, email, college, phonenumber, password) VALUES ('0', '${user.id}','${user.name}', '${user.email}', '${user.college}', '${user.phonenumber}', '${user.password}');`)
                        .then((data) => {
                            const token = jwt.sign(
                                {
                                    email: email,
                                },
                                process.env.SECRET_KEY
                            );

                            res.status(200)
                                .cookie("token", token, {                                            //Assigning token to a cookie
                                    sameSite: 'none', secure: true,
                                    expires: new Date(new Date().getTime() + 5 * 10000),
                                    httpOnly: true,
                                })
                                .json(
                                    {
                                        message: "User added",
                                        cookie_status: "Assigned",
                                        token: token,
                                        verification_status: "pending",
                                    }
                                );
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                error: "Database error pls try again",          //Database connection error
                            });
                        });
                });
            }
        }
    })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: "Internal server error occurred!",                      //Server connection error   
            });
        });
};

//Verification Function
exports.verify = (req, res) => {
    const { otp } = req.params;
    const { email } = req.params;


    client
        .query(`SELECT * FROM users WHERE id = $1;`, [otp])                    //Checking if user exists or not
        .then((data) => {
            userData = data.rows;

            if (userData.length === 0) {
                res.status(400).json({
                    error: "User not found",
                });
            }
            else {
                client.query(`UPDATE users SET verified = '1' WHERE email = $1`,   //set user account as verified
                    [email], (err) => {
                        if (err)
                            res.status(500).send(err);
                        else
                            res.status(200).json({
                                message: "User verified"
                            })
                    })
            }
        })


}

//Login Function
exports.login = (req, res) => {
    const { email, password } = req.body;

    client
        .query(`SELECT * FROM users WHERE email= $1;`, [email])                        //Verifying if the user exists in the database
        .then((data) => {
            userData = data.rows;

            if (userData.length === 0) {
                res.status(400).json({
                    error: "User does not exist, Sign Up first",
                });
            }
            else {
                bcrypt.compare(password, userData[0].password, (err, result) => {                       //Comparing the hashed password
                    if (err) {
                        res.status(500).json({
                            error: "Server error",
                        });
                    } else if (result === true && userData[0].verified === '1') {
                        const token = jwt.sign(
                            {
                                email: email,
                            },
                            process.env.SECRET_KEY
                        );
                        res.status(200)
                            .cookie("token", token, {                                                //Assigning the token to a cookie
                                sameSite: 'none', secure: true,
                                expires: new Date(new Date().getTime() + 5 * 10000),
                                httpOnly: true,
                            })
                            .json({
                                message: "User signed in!",
                                token: token,
                            });
                    }
                    else {
                                                                                                    //Declaring the errors 
                        if (result != true)
                            res.status(400).json({
                                error: "Enter correct password!",                                       
                            });

                        else
                            res.status(400).json({
                                error: "User not verified, Verify your account first."
                            })
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: "Database error occurred while signing in.",
            });
        });
};

