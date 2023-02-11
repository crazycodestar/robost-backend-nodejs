import { prisma } from "../config/prismaConfig";

export const getAllUsers = async (req, res) => {
	const users = await prisma.user.findMany();
	if (!users) return res.status(204).json({ message: "No users found" });
	res.json(users);
};

export const deleteUser = async (req, res) => {
	if (!req?.body?.id)
		return res.status(400).json({ message: "User ID required" });
	const user = await prisma.user.findUnique({ where: { id: req.body.id } });
	if (!user) {
		return res
			.status(204)
			.json({ message: `User ID ${req.body.id} not found` });
	}
	const result = await prisma.user.delete({ where: { id: req.body.id } });
	res.json(result);
};

export const getUser = async (req, res) => {
	if (!req?.params?.id)
		return res.status(400).json({ message: "User ID required" });
	const user = await prisma.user.findUnique({ where: { id: req.body.id } });
	if (!user) {
		return res
			.status(204)
			.json({ message: `User ID ${req.params.id} not found` });
	}
	res.json(user);
};
