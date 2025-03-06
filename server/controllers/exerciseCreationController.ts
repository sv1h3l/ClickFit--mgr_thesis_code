import { Request, Response } from "express";
import { createExercise, ExerciseCreationStatus } from "../models/createExercise";

export const exerciseCreationController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseName, categoryId, orderNumber } = req.body;

	if (!exerciseName) {
		res.status(400).json({ message: "Název cviku nesmí být prázdný" });
		return;
	}

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	try {
		const dbRes = await createExercise({ props: { sportId, exerciseName, orderNumber, categoryId } });

		switch (dbRes.status) {
			case ExerciseCreationStatus.SUCCESS:
				res.status(201).json({
					message: "Cvik byl úspěšně vytvořen",
					data: {
						exerciseId: dbRes.exerciseId,
					},
				});

				break;
			case ExerciseCreationStatus.ALREADY_EXISTS:
				res.status(409).json({ message: "Cvik s tímto názvem již existuje" });
				break;
			default:
				res.status(500).json({ message: "Neznámá chyba při vytváření cviku" });
				break;
			//TODO → kontrola jestli kategorie existuje
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
