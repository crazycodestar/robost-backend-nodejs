import prisma from "../config/prismaConfig";
import { Request, Response } from "express";

export const getAllUsers = async (_: Request, res: Response) => {
	const users = await prisma.user.findMany();
	if (!users) return res.status(204).json({ message: "No users found" });
	return res.status(200).json({ message: users });
};

export const deleteUser = async (req: Request, res: Response) => {
	if (!req?.body?.id)
		return res.status(400).json({ message: "User ID required" });
	const user = await prisma.user.findUnique({ where: { id: req.body.id } });
	if (!user) {
		return res
			.status(204)
			.json({ message: `User ID ${req.body.id} not found` });
	}
	const result = await prisma.user.delete({ where: { id: req.body.id } });
	return res.status(200).json({ message: result });
};

export const getUser = async (req: Request, res: Response) => {
	if (!req?.params?.id)
		return res.status(400).json({ message: "User ID required" });
	const user = await prisma.user.findUnique({ where: { id: req.body.id } });
	if (!user) {
		return res
			.status(204)
			.json({ message: `User ID ${req.params.id} not found` });
	}
	return res.status(200).json({ message: user });
};
