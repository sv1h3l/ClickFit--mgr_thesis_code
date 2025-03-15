import { Request, Response } from "express";
import { createResidueCategory } from "../../models/create/createResidueCategory";
import { createSport, SportCreationStatus } from "../../models/create/createSport";
import { getUserIdFromEmail } from "../../models/get/getUserIdFromEmail";
import { getUserNameFromId } from "../../models/get/getUserNameFromId";

export interface Value {
	orderNumber: number;
	name: string;
}

export const createSportController = async (req: Request, res: Response): Promise<void> => {
	const { sportName, userEmail } = req.body;

	if (!sportName) {
		res.status(400).json({ message: "Název sportu nesmí být prázdný" });
		return;
	}

	const userId = await getUserIdFromEmail(userEmail);

	try {
		const dbRes = await createSport(userId, sportName);

		switch (dbRes.status) {
			case SportCreationStatus.SUCCESS:
				dbRes.sportId && createResidueCategory(dbRes.sportId);

				const userName = await getUserNameFromId(userId);

				res.status(201).json({
					message: "Sport byl úspěšně vytvořen",
					data: {
						sportId: dbRes.sportId,
						userName: userName,
						userId: userId,
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
