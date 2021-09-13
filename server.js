const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./models");
const route = require("./routes/routes.js");
db.sequelize.sync();

// let corsOptions = {
//   origin: "http://localhost:4000"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the best Bus Booking experience ever!!" });
});

//app.post("/api/mobiles", mobiles.create);
// app.get("/:id", mobiles.findOne);

app.use('/' , route);

// set port, listen for requests
const PORT = process.env.PORT || 4000 ;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "*"
  );
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
