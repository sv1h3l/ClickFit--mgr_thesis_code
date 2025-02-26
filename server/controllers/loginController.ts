const cookie = require("cookie");

import { Request, Response } from "express";
import { LoginStatus, loginUser } from "../models/loginUser";

export const loginController = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email) || password.length < 8) {
		res.status(401).json({ message: "Neplatné přihlašovací údaje" });
		return;
	}

	try {
		const status = await loginUser(email, password);

		switch (status) {
			case LoginStatus.SUCCESS:
				res.setHeader(
					"Set-Cookie",
					cookie.serialize("userEmail", email, {
						maxAge: 60 * 60 * 24 * 14, // Cookie will expire in 14 days
						path: "/", // The cookie is available for the entire site
					})
				);

				res.status(200).json({ message: "Přihlášení bylo úspěšné" });
				break;
			case LoginStatus.FAILURE:
				res.status(401).json({ message: "Neplatné přihlašovací údaje" });
				break;
			case LoginStatus.USER_INACTIVE:
				res.status(403).json({ message: "Je nutné potvrdit registraci skrze příchozí email" });
				break;
			default:
				res.status(500).json({ message: "Neznámá chyba" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
