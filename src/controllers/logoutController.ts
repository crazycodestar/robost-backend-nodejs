import { Request, Response } from "express";
import { REFRESH_TOKEN_SECRET } from "../config/environment";
import client from "../config/redisConfig";
import jwt from "jsonwebtoken";
import { tokenObject } from "./refreshTokenController";

export const handleLogout = async (req: Request, res: Response) => {
	// client: delete the accessToken
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	try {
		const user = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
		if (user) await client.del((user as tokenObject).id.toString());
		// clearr cookie
		res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
	} catch (err) {
		// clearr cookie
		res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
		return res.sendStatus(204);
	}

	return res.sendStatus(204);
};
