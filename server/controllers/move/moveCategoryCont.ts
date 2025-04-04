import { Request, Response } from "express";
import { GenEnum } from "../../utilities/GenResEnum";
import { reorderCategoriesMod } from "../../models/move/reorderCategoriesMod";

export const moveCategoryCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, reorderCategories } = req.body;

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (reorderCategories.length < 1) {
		res.status(400).json({ message: "Nebyly předány kategorie pro přeuspořádání" });
		return;
	}

	try {
		const dbReorderResult = await reorderCategoriesMod({ props: { sportId, reorderCategories } });

		switch (dbReorderResult.status) {
			case GenEnum.SUCCESS:
				res.status(201).json({
					message: "Kategorie byly úspěšně přeuspořádány",
				});
				break;
			default:
				console.error(dbReorderResult.message);

				res.status(500).json({ message: "Nastala chyba během přeuspořádávání kategorií" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
