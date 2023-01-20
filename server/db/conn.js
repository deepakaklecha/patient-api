const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const DB = process.env.DATABASE;
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.log(err);
  });
