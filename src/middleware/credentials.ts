import allowedOrigins from "../config/allowedOrigins";
import { Request, Response, NextFunction } from "express";

const credentials = (req: Request, res: Response, next: NextFunction) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		// FIXME: changed allowedOrigins from true
		res.header("Access-Control-Allow-Credentials", allowedOrigins);
	}
	next();
};

export default credentials;
