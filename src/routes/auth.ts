import express from "express";
import { handleLogin } from "../controllers/authController";

const router = express.Router();

router.post("/", handleLogin);

module.exports = router;
