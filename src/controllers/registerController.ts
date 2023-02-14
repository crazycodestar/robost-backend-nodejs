import prisma from "../config/prismaConfig";
import bcrypt from "bcrypt";
import * as Joi from "joi";
import registerValidation from "../validation/registerValidation";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index";

// TODO: add email validatoin

export const handleNewUser = async (req: Request, res: Response) => {
	try {
		const { username, password, email } =
			await registerValidation.validateAsync(req.body);
		const hashedPwd = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, username, password: hashedPwd },
		});
		return res.status(200).json({ message: user });
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
