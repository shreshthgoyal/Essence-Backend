const bcrypt = require("bcrypt");
const client = require("../configs/database");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const passwordValidator = require('password-validator');

const otp = Math.floor(Math.random() * 9000) + 1000;                                                             //Randomly generated string

                                                                                                                 //Registration Function
exports.register = async (req, res) => {
    const { name, email, college, phonenumber, password } = req.body;
    try {
        const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [email]);                        //Checking if user already exists
        const arr = data.rows;

        if (arr.length != 0) {
            return res.status(400).json({
                error: "User already exists",
            });
        }
        else {
            let schema = new passwordValidator();                                                                // Validating Password conditions

            schema
                .is().min(8)                                                                                     // Minimum length 8
                .is().max(100)                                                                                   // Maximum length 100
                .has().uppercase()                                                                               // Must have uppercase letters
                .has().lowercase()                                                                               // Must have lowercase letters
                .has().digits(2)                                                                                 // Must have at least 2 digits
                .has().not().spaces()                                                                            // Should not have spaces

            if (!schema.validate(password)) {
                return res.status(500).json({
                    error: "Input a Strong Password of minimum 8 characters consisting of upper and lowercase letters and atleast 2 digits."
                })
            }

            else {
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

                    var flag = 1;                                                                                //Declaring a flag

                                                                                                                 //Inserting data into the database

                    client
                        .query(`INSERT INTO users (id, name, email, college, phonenumber, password) VALUES ('${user.id}','${user.name}', '${user.email}', '${user.college}', '${user.phonenumber}', '${user.password}');`, (err) => {
                            if (err) {
                                flag = 0;                                                                        //If user is not inserted is not inserted to database assigning flag as 0/false.
                                console.error(err);
                                return res.status(500).json({
                                    error: "Database error"
                                })
                            }
                            else {
                                res.status(200).send({ message: 'User added to database, not verified' });
                            }
                        })

                    if (flag) {                               
                        const token = jwt.sign(                                                  //Signing a jwt token to verify the user
                            {
                                email: user.email
                            },
                            process.env.SECRET_KEY
                        );
            
                        res.status(200)
                            .cookie("token", token, {                                            //Assigning token to a cookie
                                sameSite: 'none', secure: true,
                                expires: new Date(new Date().getTime() + 5 * 10000),
                                httpOnly: true,
                            })
                        
                        console.log("Verifying token signed");

                        createEmailTemplate = () => {
                            const html =
                                `
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
                                                       <a href="https:                                                       //localhost:5000/user/verify/${token}"><button>You must verify your identity!</button></a>
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
                            return html;
                        }
                        const emailTemplate = createEmailTemplate();
    
                        var mail = {                                                                                 //Sending a Verification mail to the user
                            from: "Essence Fest <essence21webkriti@gmail.com>",                                      //Add your email here
                            to: user.email,                                                                          //Add the email to whom you wish to send
                            subject: 'Verify Account',
                            html: emailTemplate
                        }
    
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            secure: true,
                            auth: {
                                type: 'OAuth2',
                                user: 'essence21webkriti@gmail.com',                                                 //Add your email here
                                pass: process.env.MAIL_PASS,                                                         //Add your password here
                                clientId: process.env.CLIENT_ID,                                                     //Add your client id here
                                clientSecret: process.env.CLIENT_SECRET,                                             //Add your client secret key here
                                refreshToken: process.env.REFRESH_TOKEN,                                             //Add your refresh token here
                                accessToken: process.env.ACCESS_TOKEN                                                //Add your access token
                            }
                        })
                                                                              
                        transporter.sendMail(mail, function (err, info) {                                        //Sending a mail only if flag is true
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Email sent");
                            }
                            transporter.close();
                        });
                    }
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error while registring user!",                                                      //Database connection error   
        });
    };
};



