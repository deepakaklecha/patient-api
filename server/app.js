const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config({ path: "./config.env" });

require("./db/conn");
app.use(express.json());
const User = require("./model/userSchema");
app.use(require("./router/auth"));
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
