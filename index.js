const express = require("express");
const cors = require("cors")
const app = express();
const userrouter = require("../backend/routes/user");
app.use(express.json());
app.use("/user",userrouter)
app.use(cors());


app.listen(3000);

