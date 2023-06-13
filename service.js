const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(express.json());
require("dotenv").config();
require("./utils/db_connection.js");
var cors = require('cors')

app.use(cors())

app.use('/slider_image', express.static('./public/slider_images'))


app.get("/home", (req, res) => {
    res.send("welcome to home page mandal")
})

require("./route/roter.js")(app);

app.listen(process.env.PORT, () => {
    console.log(`server start on localhost:${process.env.PORT}`)
})