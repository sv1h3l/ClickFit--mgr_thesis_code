import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { changeUserPswMod } from "../../models/change/changeUserPswMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeUserPswCont = async (req: Request, res: Response): Promise<void> => {
	const { password, confirmPassword } = req.body;

	let error = false;
	let data: { passwordHelperText: string; confirmPasswordHelperText: string } = { passwordHelperText: "", confirmPasswordHelperText: "" };

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
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const dbRes = await changeUserPswMod({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, hashedPassword });

		res.status(dbRes.status).json({ message: dbRes.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
