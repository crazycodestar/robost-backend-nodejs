import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/environment";
import client from "../config/redisConfig";

export type tokenObject = { id: number };

export const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken: string = cookies.jwt;

	try {
		const user: tokenObject = await jwt.verify(
			refreshToken,
			REFRESH_TOKEN_SECRET
		);

		const data = await client.get((user as tokenObject).id.toString());
		if (data !== refreshToken) return res.sendStatus(403);

		const accessToken = jwt.sign(
			{
				UserInfo: {
					id: user.id,
					// roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "10s" }
		);
		return res.json({ accessToken });
	} catch (err) {
		return res.sendStatus(403);
	}
};
