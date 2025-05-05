import { Request, Response } from "express";
import { getTrainingPlansMod } from "../../models/get/getTrainingPlansMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const getTrainingPlansCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	const dbUserAtr = await getUserAtrFromAuthTokenMod({ req, authToken });
	if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
		res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
		return;
	}

	try {
		const dbResTrainingPlans = await getTrainingPlansMod({ userId: dbUserAtr.data.userId });

		res.status(dbResTrainingPlans.status).json({
			message: dbResTrainingPlans.message,
			data: {
				userId: dbUserAtr.data.userId,
				trainingPlans: dbResTrainingPlans.data,
			},
		});
	} catch (error) {
		console.error("Chyba při získání tréninkových plánů: ", error);
		res.status(500).json({ message: "Chyba při získání tréninkových plánů" });
	}
};
