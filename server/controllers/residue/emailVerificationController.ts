import { Request, Response } from "express";
import { getToken } from "../../models/get/getToken";
import { sendVerificationEmail } from "../../services/verificationService";

export const emailVerificationController = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email)) {
		res.status(401).json({ message: "Neplatná emailová adresa" });
		return;
	}

	try {
		const token = await getToken(email);

		if (!token) {
			res.status(401).json({ message: "Nebyl nalezen účet s tímto emailem" });
			return;
		}

		sendVerificationEmail(email, token);

		res.status(200).json({ message: "Byl zaslán ověřovací email" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
