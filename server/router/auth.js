const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

require("../db/conn");
const User = require("../model/userSchema");

//get Request
router.get("/patients", async (req, res) => {
  try {
    const patients = await User.find();
    res.send(patients);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//register
//post request
router.post("/register", async (req, res) => {
  const { name, email, phone, age, gender, password, cpassword } = req.body;
  if (!name || !email || !phone || !age || !gender || !password || !cpassword) {
    return res.status(422).json({ error: "Plzz fill all the fields" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password are not matching" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        age,
        gender,
        password,
        cpassword,
      });
      await user.save();
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//user login or signin

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.json({ message: "User signin successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//delete request-
router.delete("/:id", async (req, res) => {
  try {
    const deletedPatient = await User.findByIdAndDelete(req.params.id);
    res.send(deletedPatient);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

//put request-
router.put("/:id", async (req, res) => {
  const { name, email, phone, age, gender, password, cpassword } = req.body;
  const patient = await User.findById(req.params.id);
  if (!patient) return res.status(404).send("patient details not found");

  try {
    const updatedPatient = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        age,
        gender,
        password,
        cpassword,
      },
      { new: true }
    );
    res.send(updatedPatient);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
