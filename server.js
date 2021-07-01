//imported modules
require("./configs/dotenv");
const express = require("express");
const cors = require("cors");
const userauth = require("./routes/auth");
const client = require("./configs/database");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const compression = require('compression')

//added middlewares

const app = express();                          //Initialized express
app.use(express.json());                     
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  next();
}); 

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("Engine Started, Ready to take off!");
})

app.use("/user", userauth);                      //Route for /user endpoint of API

client.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Data logging initiated!");
});

app.listen(port, () => {                                           //Inititating server
  console.log(`Here we go, Engines started at ${port}.`);
})
