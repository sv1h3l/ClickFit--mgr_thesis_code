import { Request, Response } from "express";
import { getConnectionAtrsMod } from "../../models/get/getConnectionAtrsMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const getConnectionAtrsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	try {
		const dbUserAtr = await getUserAtrFromAuthTokenMod({ req, authToken });
		if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
			res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
			return;
		}

		const resConnectionAtrs = await getConnectionAtrsMod({ userId: dbUserAtr.data.userId });

		res.status(resConnectionAtrs.status).json({ message: resConnectionAtrs.message, data: resConnectionAtrs.data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
