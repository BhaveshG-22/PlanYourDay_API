const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { userRouter } = require("./routes/users.js");
const { dataRouter } = require("./routes/data.js");
const { convRouter } = require("./routes/conv.js");

const app = express();
const mongoURI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});
dotenv.config();

app.use("/auth", userRouter);
app.use("/data", dataRouter);
app.use("/getConverstion", convRouter);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 2002;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});


// Export the Express API
module.exports = app