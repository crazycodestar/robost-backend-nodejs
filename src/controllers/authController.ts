// const User = require("../model/User");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaConfig";

export const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res
			.status(400)
			.json({ message: "Username and password are required." });

	const foundUser = await prisma.user.findUnique({ where: { username: user } });
	// const foundUser = await User.findOne({ username: user }).exec();
	if (!foundUser) return res.sendStatus(401); //Unauthorized
	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		// const roles = Object.values(foundUser.roles).filter(Boolean);
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "10s" }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);
		// Saving refreshToken with current user
		// TODO: handle refreshtoken here
		// foundUser.refreshToken = refreshToken;
		// const result = await foundUser.save();
		// console.log(result);

		// Creates Secure Cookie with refresh token
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60 * 1000,
		});

		// Send authorization roles and access token to user
		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};
