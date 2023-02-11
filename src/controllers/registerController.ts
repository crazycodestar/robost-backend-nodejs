import { prisma } from "../config/prismaConfig";
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
		return res.json({ status: "success", message: user }).status(200);
	} catch (err) {
		if (err instanceof Joi.ValidationError) {
			return res.json({
				status: "failed",
				message: err.details[0].message,
			});
		}

		if (err instanceof PrismaClientKnownRequestError) {
			if (err.code === "P2002") {
				return res.json({
					status: "failed",
					message: "user already exists",
				});
			}
		}
		console.error(err);
		res.json({ status: "failed", message: "something went wrong" });
	}
};
