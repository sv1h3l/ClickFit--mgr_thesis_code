import { Request, Response } from "express";
import { deleteTokenMod } from "../../models/delete/deleteTokenMod";
import { activateUserMod } from "../../models/residue/activateUserMod";
import { newPswMod } from "../../models/residue/newPswMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const newPswCont = async (req: Request, res: Response): Promise<void> => {
	const { token, password, confirmPassword } = req.body;

	const errors: Record<string, string> = {};

	let error = false;
	let data: { tokenHelperText: string; passwordHelperText: string; confirmPasswordHelperText: string } = { tokenHelperText: "", passwordHelperText: "", confirmPasswordHelperText: "" };

	if (!token) {
		data = { ...data, tokenHelperText: "Chybějící token" };
		error = true;
	}

	if (password.length < 8) {
		data = { ...data, passwordHelperText: "Heslo musí obsahovat alespoň 8 znaků" };
		error = true;
	}

	if ((confirmPassword === "" && password !== confirmPassword) || password !== confirmPassword) {
		data = { ...data, confirmPasswordHelperText: "Hesla se neshodují" };
		error = true;
	}

	if (error) {
		res.status(400).json({ message: "Heslo nesplňuje požadavky", data });
		return;
	}

	try {
		const newPswRes = await newPswMod({ token, password });

		if (newPswRes.status === GenEnum.SUCCESS) {
			activateUserMod(token);
			deleteTokenMod(token);
		}

		res.status(newPswRes.status).json({ message: newPswRes.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
