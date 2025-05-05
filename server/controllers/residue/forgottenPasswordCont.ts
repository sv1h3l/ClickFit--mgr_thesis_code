import { Request, Response } from "express";
import { createTokenMod } from "../../models/create/createTokenMod";
import { getTokenMod } from "../../models/get/getTokenMod";
import { forgottenPassword, ForgottenPasswordStatus } from "../../models/residue/forgottenPasswordMod";
import { modifyTokenExpirationMod } from "../../models/residue/modifyTokenExpirationMod";
import { sendForgottenPasswordEmail } from "../../services/forgottenPasswordService";

const statusOk = async (res: Response, email: string) => {
	res.status(200).json({ message: "OK" });

	const token = await getTokenMod(email);
	if (token) {
		sendForgottenPasswordEmail(email, token);
	}
};

export const forgottenPasswordCont = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.body;

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email)) {
		res.status(401).json({ message: "Neplatná emailová adresa" });
		return;
	}

	try {
		const status = await forgottenPassword(email);

		switch (status) {
			case ForgottenPasswordStatus.ADD_TOKEN:
				await createTokenMod(email);
				statusOk(res, email);
				break;
			case ForgottenPasswordStatus.MODIFY_EXPIRATION:
				await modifyTokenExpirationMod(email);
				statusOk(res, email);
				break;
			case ForgottenPasswordStatus.FAILURE:
				res.status(500).json({ message: "Neznámá chyba" });
				break;
			case ForgottenPasswordStatus.NO_USER_FOUND:
				statusOk(res, email);
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
