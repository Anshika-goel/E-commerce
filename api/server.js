
const express = require("express");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config({
    path: __dirname + "/.env"
});



app.use(express.json());

const db = process.env.MONGODB_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected!");

    app.get("/welcome", (req, res) => {
      res.status(200).json({
        message: "Welcome to my API",
      });
    });
    app.use("/api/product", require("./src/routes/product.routes"));

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Coudn't connect");
  });

