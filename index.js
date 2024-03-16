const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors());

//routes
const register = require("./routes/register.js");
const checkUsername = require("./routes/checkUsername.js");
const login = require("./routes/login.js");
const eventos = require("./routes/eventos.js");
const recordatorios = require("./routes/recordatorios.js");
const secretKey = require('./routes/secretKey');
const organizaciones =  require('./routes/organizations.js');
const user = require('./routes/user.js');
const activities = require('./routes/activities.js');
const groups = require('./routes/groups.js');


// Ruta al endpoint de la API
app.use("/api/", register);
app.use("/api/", checkUsername);
app.use("/api/", login);
app.use("/api/", eventos);
app.use("/api/", recordatorios);
app.use("/api/", organizaciones);
app.use("/api/", user);
app.use("/api/", activities);
app.use("/api/", groups);


app.get("/", (req, res) => {
    res.send(`Working on ${PORT}. Welcome to the ${process.env.APP_NAME}`);
});
  
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB working"));
  
app.use("/api/", (req, res) => {
    res.send(`Working on ${PORT}. Welcome to the ${process.env.APP_NAME} API!`);
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.listen(PORT, console.log("Server running on " + PORT));