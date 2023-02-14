import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaConfig";
import { Request, Response } from "express";
import authValidation from "../validation/authValidation";
import * as Joi from "joi";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index";
import {
	ACCESS_TOKEN_SECRET,
	EXPIRESIN,
	REFRESH_TOKEN_SECRET,
} from "../config/environment";
import client from "../config/redisConfig";

export const handleLogin = async (req: Request, res: Response) => {
	try {
		const { email, password } = await authValidation.validateAsync(req.body);
		const foundUser = await prisma.user.findUnique({
			where: { email },
		});
		if (!foundUser) return res.sendStatus(401); //Unauthorized
		const match = await bcrypt.compare(password, foundUser.password);
		if (!match) return res.sendStatus(401);
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
				},
			},
			ACCESS_TOKEN_SECRET,
			{ expiresIn: "10s" }
		);
		const refreshToken = jwt.sign({ id: foundUser.id }, REFRESH_TOKEN_SECRET, {
			expiresIn: "1d",
		});
		// Saving refreshToken with current user
		client.setEx(foundUser.id.toString(), EXPIRESIN, refreshToken);

		// Creates Secure Cookie with refresh token
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: EXPIRESIN * 1000,
		});

		// Send authorization roles and access token to user
		return res.status(200).json({ accessToken });
	} catch (err) {
		if (err instanceof Joi.ValidationError) {
			return res.status(400).json({
				message: err.details[0].message,
			});
		}

		if (err instanceof PrismaClientKnownRequestError) {
			if (err.code === "P2002") {
				return res.status(409).json({
					message: "user already exists",
				});
			}
		}
		console.error(err);
		return res.json({ message: "something went wrong" });
	}
};
