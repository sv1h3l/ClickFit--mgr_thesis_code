import { Request, Response } from "express";
import { changeUserHealthMod } from "../../models/change/changeUserHealthMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeUserHealthCont = async (req: Request, res: Response): Promise<void> => {
	const { health } = req.body;

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbRes = await changeUserHealthMod({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, health });

		res.status(dbRes.status).json({ message: dbRes.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
