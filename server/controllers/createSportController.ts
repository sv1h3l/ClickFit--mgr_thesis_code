import { Request, Response } from "express";
import { addExerciseInformations } from "../models/addExerciseInformations";
import { addSportCategories } from "../models/addSportCategories";
import { addSportDetails } from "../models/addSportDetails";
import { addSportDifficulties } from "../models/addSportDifficulties";
import { createSport, SportCreationStatus } from "../models/createSport";
import { deleteSportCategories } from "../models/deleteSportCategories";
import { deleteSportDifficulties } from "../models/deleteSportDifficulties";
import { getUserIdFromEmail } from "../models/getUserIdFromEmail";

export interface Value {
	orderNumber: number;
	name: string;
}

export const createSportController = async (req: Request, res: Response): Promise<void> => {
	const { sportName, sportDetails, hasASportCategories, sportCategories, hasASportDifficulties, sportDifficulties, exerciseInformations, sportDescription, email } = req.body;

	if (!sportName) {
		res.status(400).json({ message: "Název sportu nesmí být prázdný" });
		return;
	}

	const userId = await getUserIdFromEmail(email);

	try {
		const dbRes = await createSport({
			userId,
			sportName,
			sportDescription,
			hasASportCategories,
			hasASportDifficulties,
		});

		switch (dbRes.status) {
			case SportCreationStatus.SUCCESS:
				if (dbRes.sportId) {
					if (hasASportCategories) {
						addSportCategories(dbRes.sportId, sportCategories);
					} else {
						deleteSportCategories(dbRes.sportId);
					}

					if (hasASportDifficulties) {
						addSportDifficulties(dbRes.sportId, sportDifficulties);
					} else {
						deleteSportDifficulties(dbRes.sportId);
					}

					addSportDetails(dbRes.sportId, sportDetails);

					addExerciseInformations(dbRes.sportId, exerciseInformations);
				}
				res.status(201).json({ message: "Sport byl úspěšně vytvořen" });
				
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
