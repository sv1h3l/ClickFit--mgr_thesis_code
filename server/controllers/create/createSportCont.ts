import { Request, Response } from "express";
import { createDefaultDetailLabelsMod } from "../../models/create/createDefaultDetailLabelsMod";
import { createResidueCategoryMod } from "../../models/create/createResidueCategoryMod";
import { createSportMod } from "../../models/create/createSportMod";
import { createDefaultDifficultiesMod } from "../../models/create/createUnassignedDifficultyMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { getUserNameFromIdMod } from "../../models/get/getUserNameFromIdMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const createSportCont = async (req: Request, res: Response): Promise<void> => {
	const { sportName } = req.body;

	if (!sportName) {
		res.status(400).json({ message: "Název sportu nesmí být prázdný" });
		return;
	}

	const dbUserAtr = await getUserAtrFromAuthTokenMod({ req });
	if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
		res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
		return;
	}

	try {
		const dbRes = await createSportMod(dbUserAtr.data.userId, sportName);

		if (dbRes.status === GenEnum.SUCCESS && dbRes.data?.sportId) {
			createResidueCategoryMod(dbRes.data.sportId);

			createDefaultDetailLabelsMod(dbRes.data.sportId);

			createDefaultDifficultiesMod(dbRes.data.sportId);

			const userName = await getUserNameFromIdMod(dbUserAtr.data.userId);

			res.status(dbRes.status).json({
				message: dbRes.message,
				data: {
					sportId: dbRes.data.sportId,
					userName: userName,
					userEmail: dbUserAtr.data.userEmail,
					userId: dbUserAtr.data.userId,
				},
			});
			return;
		}

		res.status(dbRes.status).json({
			message: dbRes.message,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
