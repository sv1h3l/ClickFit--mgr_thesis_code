import { Request, Response } from "express";
import { createResidueCategoryMod } from "../../models/create/createResidueCategoryMod";
import { createSportMod, SportCreationStatus } from "../../models/create/createSportMod";
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

	const dbUserAtr = await getUserAtrFromAuthTokenMod({req});
	if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
		res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
		return;
	}

	try {
		const dbRes = await createSportMod(dbUserAtr.data.userId, sportName);

		switch (dbRes.status) {
			case SportCreationStatus.SUCCESS:
				dbRes.sportId && createResidueCategoryMod(dbRes.sportId);

				dbRes.sportId && createDefaultDifficultiesMod(dbRes.sportId);

				const userName = await getUserNameFromIdMod(dbUserAtr.data.userId);

				res.status(201).json({
					message: "Sport byl úspěšně vytvořen",
					data: {
						sportId: dbRes.sportId,
						userName: userName,
						userEmail: dbUserAtr.data.userEmail,
						userId: dbUserAtr.data.userId,
					},
				});

				break;
			case SportCreationStatus.ALREADY_EXISTS:
				res.status(409).json({ message: "Sport s tímto názvem již existuje" });
				break;
			default:
				res.status(500).json({ message: "Neznámá chyba při vytváření sportu" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
