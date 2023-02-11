import express from "express";
import * as path from "path";

const router = express.Router();

router.get("^/$|/index(.html)?", (req, res) => {
	res.json({ result: "returning" });
});

module.exports = router;
