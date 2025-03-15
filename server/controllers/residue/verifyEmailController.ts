import { Request, Response } from "express";
import { activateUser } from "../../models/residue/activateUser";
import { deleteToken } from "../../models/delete/deleteToken";

export const verifyEmailController = async (req: Request, res: Response): Promise<void> => {
	const { token } = req.query as { token: string };

	if (!token) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	try {
		if (await activateUser(token)) {
			deleteToken(token);

			res.status(200).json({ message: "Účet byl úspěšně aktivován." });
		} else {
			res.status(400).json({ message: "Čas pro aktivaci vypršel." });
		}
	} catch (error) {
		res.status(500).json({ message: "Chyba při aktivaci účtu." });
	}
};
