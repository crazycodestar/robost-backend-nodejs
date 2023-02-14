import express, { Response } from "express";

const router = express.Router();

router.get("^/$|/index(.html)?", (_, res: Response) => {
	res.json({ result: "returning" });
});

module.exports = router;
