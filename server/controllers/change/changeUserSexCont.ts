import { Request, Response } from "express";
import { changeUserSexMod } from "../../models/change/changeUserSexMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeUserSexCont = async (req: Request, res: Response): Promise<void> => {
	const { value } = req.body;

	if (value !== "muž" && value !== "žena" && value !== "neuvedeno") {
		res.status(400).json({ message: "Vybráno neexistující pohlaví" });
		return;
	}

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbRes = await changeUserSexMod({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, value });

		res.status(dbRes.status).json({ message: dbRes.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
