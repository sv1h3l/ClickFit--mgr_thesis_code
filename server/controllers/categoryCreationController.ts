import { Request, Response } from "express";
import { CategoryCreationStatus, createCategory } from "../models/createCategory";

export const categoryCreationController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, categoryName, orderNumber } = req.body;

	if (!categoryName) {
		res.status(400).json({ message: "Název kategorie nesmí být prázdný" });
		return;
	}

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	try {
		const dbRes = await createCategory(sportId, categoryName, orderNumber);

		switch (dbRes.status) {
			case CategoryCreationStatus.SUCCESS:
				res.status(201).json({
					message: "Kategorie byla úspěšně vytvořena",
					data: {
						categoryId: dbRes.exerciseId,
					},
				});

				break;
			case CategoryCreationStatus.ALREADY_EXISTS:
				res.status(409).json({ message: "Kategorie s tímto názvem již existuje" });
				break;
			default:
				res.status(500).json({ message: "Neznámá chyba při vytváření kategorie" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
