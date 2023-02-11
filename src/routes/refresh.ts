import express from "express";
import { handleRefreshToken } from "../controllers/refreshTokenController";

const router = express.Router();

router.get("/", handleRefreshToken);

module.exports = router;
