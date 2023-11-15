const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require("mongoose");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  //console.log("The form data:", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", { errorMessage: "All fields are required" });
    return;
  }
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
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      console.log("username and email should be unique");
    } else {
      next(error);
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render("auth/signup", {
        errorMessage: "Password needst ob stronger",
      });
    }
  }
});

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile");
});

module.exports = router;
