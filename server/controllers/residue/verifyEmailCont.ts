import { Request, Response } from "express";
import { activateUserMod } from "../../models/residue/activateUserMod";
import { deleteTokenMod } from "../../models/delete/deleteTokenMod";

export const verifyEmailCont = async (req: Request, res: Response): Promise<void> => {
	const { token } = req.query as { token: string };

	if (!token) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	try {
		if (await activateUserMod(token)) {
			deleteTokenMod(token);

			res.status(200).json({ message: "Účet byl úspěšně aktivován." });
		} else {
			res.status(400).json({ message: "Čas pro aktivaci vypršel." });
		}
	} catch (error) {
		res.status(500).json({ message: "Chyba při aktivaci účtu." });
	}
};
