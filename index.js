const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();
app.use(express.json());
app.listen(5000, () => {
  console.log("Server is running on port 5000");
})

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true })
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err)
  process.exit(1)});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
})

const User = mongoose.model("User", userSchema);

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error("Error created user: ", err);
  }
});

module.exports = app