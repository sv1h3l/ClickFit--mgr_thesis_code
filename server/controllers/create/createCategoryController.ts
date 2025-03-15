import { Request, Response } from "express";
import { CategoryCreationStatus, createCategory } from "../../models/create/createCategory";
import { incrementCategoriesOrderNumberModel } from "../../models/move/incrementCategoriesOrderNumberModel";

export const createCategoryController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, categoryName } = req.body;

	if (!categoryName) {
		res.status(400).json({ message: "Název kategorie nesmí být prázdný" });
		return;
	}

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	try {
		const dbRes = await createCategory(sportId, categoryName);

		switch (dbRes.status) {
			case CategoryCreationStatus.SUCCESS:
				if (dbRes.categoryId) {
					incrementCategoriesOrderNumberModel({ props: { sportId, categoryId: dbRes.categoryId } });
				}

				res.status(201).json({
					message: "Kategorie byla úspěšně vytvořena",
					data: {
						categoryId: dbRes.categoryId,
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
