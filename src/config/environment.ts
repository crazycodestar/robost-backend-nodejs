import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT!;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const EXPIRESIN = 24 * 60 * 60;

const ENV = {
	development: process.env.NODE_ENV === "development",
	test: process.env.NODE_ENV === "test",
	staging: process.env.NODE_ENV === "staging",
	production: process.env.NODE_ENV === "production",
};

export { PORT, ENV, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, EXPIRESIN };
