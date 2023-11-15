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

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.render("/auth/login", {
      errorMessage: "please enter both",
    });
    return;
  }
  try {
    const findEmail = await User.findOne({ email });
    const { password: hashedPassword } = findEmail;
    console.log(hashedPassword);
    if (!findEmail) {
      console.log("the email is not registered");
      res.render("user/user-profile", { errorMessage: "User not found" });
    } else if (bcryptjs.compare(password, hashedPassword)) {
      res.render("users/user-profile", { user: findEmail });
    } else {
      console.log("incorrect password");
      res.render("auth/login", { errorMessage: "User nto ound" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
