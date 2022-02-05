const express = require("express");
const router = new express.Router();
const ProfileController = require("../controllers/ProfileController");

router.get("/profile", ProfileController.index);
