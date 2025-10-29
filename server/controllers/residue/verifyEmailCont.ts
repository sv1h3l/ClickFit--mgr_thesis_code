import { Request, Response } from "express";
import { activateUserMod } from "../../models/residue/activateUserMod";
import { deleteTokenMod } from "../../models/delete/deleteTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const verifyEmailCont = async (req: Request, res: Response): Promise<void> => {
	// HACK complete
	
	const { token } = req.query as { token: string };

	if (!token) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	try {
		const response = await activateUserMod(token);

		if (response.status === GenEnum.SUCCESS){
			deleteTokenMod(token);
		}
		
		res.status(response.status).json({ message: response.message });
	} catch (error) {
		res.status(500).json({ message: "Chyba při aktivaci účtu." });
	}
};
