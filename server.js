//imported modules
require("./configs/dotenv");
const express = require("express");
const cors = require("cors");
const user = require("./routes/user");
const admin = require("./routes/admin");
const events = require("./routes/events");
const pronites = require("./routes/pronites");
const goodies = require("./routes/goodies");
const client = require("./configs/database");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const compression = require('compression')

//Middlewares

const app = express();                          //Initialized express
app.use(express.json()); 
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(compression());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("Engine Started, Ready to take off!");
})

app.use("/user", user);                    //Route for /user endpoint of API
app.use("/admin", admin);                      //Route for /admin endpoint of API
app.use("/events", events);                       //Route for /events endpoint of API
app.use("/pronites", pronites);                //Route for pronite registration
app.use("/goodies", goodies);                   //Route for goodies purchase

client.connect((err) => {                         //Connected Database
  if (err) {
    console.log(err);
  }
  else {
  console.log("Data logging initiated!");}
});

app.listen(port, () => {                                           //Inititating server
  console.log(`Here we go, Engines started at ${port}.`);
})
