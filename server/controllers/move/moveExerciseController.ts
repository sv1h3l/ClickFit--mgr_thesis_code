import { Request, Response } from "express";
import { GenericModelReturnEnum } from "../../models/GenericModelReturn";
import { reorderExercisesModel } from "../../models/move/reorderExercisesModel";

export const moveExerciseController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, reorderExercises } = req.body;

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	if (reorderExercises.length < 1) {
		res.status(400).json({ message: "Nebyly předány cviky pro přeuspořádání" });
		return;
	}

	try {
		const dbReorderResult = await reorderExercisesModel({ props: { sportId, reorderExercises } });

		switch (dbReorderResult.status) {
			case GenericModelReturnEnum.SUCCESS:
				res.status(201).json({
					message: "Cviky byly úspěšně přeuspořádány",
				});
				break;
			default:
				console.error(dbReorderResult.message);

				res.status(500).json({ message: "Nastala chyba během přeuspořádávání cviku" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
