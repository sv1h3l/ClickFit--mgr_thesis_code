import { Request, Response } from "express";
import { activateUserMod } from "../../models/residue/activateUserMod";
import { deleteTokenMod } from "../../models/delete/deleteTokenMod";
import { newPswMod } from "../../models/residue/newPswMod";

export const newPswCont = async (req: Request, res: Response): Promise<void> => {
	const { token, password, confirmPassword } = req.body;

	const errors: Record<string, string> = {};

	!token && (errors.token = "Chybějící token");
	password !== confirmPassword && (errors.confirmPassword = "Hesla se neshodují");
	password.length < 8 && (errors.password = "Heslo musí obsahovat alespoň 8 znaků");

	// Pokud existují chyby, vrátí se všechny najednou
	if (Object.keys(errors).length > 0 || password.length > 40) {
		res.status(400).json({ errors });
		return;
	}

	try {
		if (await newPswMod(token, password)) {

			activateUserMod(token);
			deleteTokenMod(token);

			res.status(200).json({ message: "Heslo bylo úspěšně změněno." });
		} else {
			res.status(401).json({ message: "Čas pro změnu hesla vypršel." });
		}
	} catch (error) {
		res.status(500).json({ message: "Chyba při změně hesla." });
	}
};
