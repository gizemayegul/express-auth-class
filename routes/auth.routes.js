const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  //console.log("The form data:", req.body);
  const { username, email, password } = req.body;
  try {
    const getBycrypt = await bcryptjs.genSalt(saltRounds, password);
    const hashPassword = await bcryptjs.hash(getBycrypt, saltRounds);
    console.log("Password:", hashPassword);
    const saveDataBase = await User.create({
      email,
      username,
      password: hashPassword,
    });
    console.log("new created user ", saveDataBase);

    res.redirect("/userProfile");
  } catch (error) {
    console.error(error);
  }
});

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile");
});

module.exports = router;
