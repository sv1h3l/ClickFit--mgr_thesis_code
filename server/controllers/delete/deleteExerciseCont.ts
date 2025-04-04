import { Request, Response } from "express";
import { GenEnum } from "../../utilities/GenResEnum";
import { deleteExerciseMod } from "../../models/delete/deleteExerciseMod";
import { reorderExercisesMod } from "../../models/move/reorderExercisesMod";

export const deleteExerciseCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, categoryId, exerciseId, orderNumber, orderNumberWithoutCategories } = req.body;

	if (!sportId || !exerciseId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	try {
		const dbDeleteResult = await deleteExerciseMod({ props: { sportId, exerciseId } });

		switch (dbDeleteResult.status) {
			case GenEnum.SUCCESS:
				const dbReorderResult = await reorderExercisesMod({ sportId, categoryId, orderNumber, orderNumberWithoutCategories });

				switch (dbReorderResult.status) {
					case GenEnum.SUCCESS:
						res.status(201).json({
							message: "Cvik byl úspěšně odstraněn a následující cviky přeuspořádány",
						});
						break;
					default:
						console.error(dbReorderResult.message);

						res.status(500).json({ message: "Nastala chyba během přeuspořádávání cviku" });
						break;
				}
				break;
			default:
				console.error(dbDeleteResult.message);

				res.status(500).json({ message: "Nastala chyba během odstraňování cviku" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
