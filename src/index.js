const express = require("express");

const app = express();

//dynamic port
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!!!"));

app.listen(port, () => console.log("Server has begun on port 3000"));
