import express from "express";
import { handleLogout } from "../controllers/logoutController";

const router = express.Router();

router.get("/", handleLogout);

module.exports = router;
