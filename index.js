const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const jwt = require("jsonwebtoken")

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())
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

const authenticateMiddleWare = async (req, res, next) => {
  const {name, email, password} = req.body
  const userDetails = await User.find({name})
  console.log(userDetails)
  if (userDetails.length == 0){
    const payload = {
      name: name,
      email: email,
      password: password
    }
    const token = jwt.sign(payload, "MY_SECRET_CODE")
    res.send({
      jwtToken: token
    })
  }else{
    res.send("user already registered")
  }
}

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

app.post("/register", authenticateMiddleWare, async (req, res) => {

})

module.exports = app