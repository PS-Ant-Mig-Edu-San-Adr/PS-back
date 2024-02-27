const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

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
// const example = require("./routes/example");

// Ruta al endpoint de la API
// app.use("/api", example);


app.get("/", (req, res) => {
    res.send(`Working on ${PORT}. Welcome to the ${process.env.APP_NAME} API!`);
  });
  
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB working"));
  
app.use("/api/", (req, res) => {
    res.send(`Working on ${PORT}. Welcome to the ${process.env.APP_NAME} API!`);
});

app.listen(PORT, console.log("Server running on " + PORT));