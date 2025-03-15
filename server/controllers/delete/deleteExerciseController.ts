import { Request, Response } from "express";
import { GenericModelReturnEnum } from "../../models/GenericModelReturn";
import { deleteExerciseModel } from "../../models/delete/deleteExerciseModel";
import { reorderExercisesModel } from "../../models/move/reorderExercisesModel";

export const deleteExerciseController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, reorderExercises } = req.body;

	if (!sportId || !exerciseId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	try {
		const dbDeleteResult = await deleteExerciseModel({ props: { sportId, exerciseId } });

		switch (dbDeleteResult.status) {
			case GenericModelReturnEnum.SUCCESS:
				let dbReorderResult;
				if (reorderExercises.length > 0) {
					dbReorderResult = await reorderExercisesModel({ props: { sportId, reorderExercises } });

					switch (dbReorderResult.status) {
						case GenericModelReturnEnum.SUCCESS:
							res.status(201).json({
								message: "Cvik byl úspěšně odstraněn a následující cviky přeuspořádány",
							});
							break;
						default:
							console.error(dbReorderResult.message);

							res.status(500).json({ message: "Nastala chyba během přeuspořádávání cviku" });
							break;
					}
				} else {
					res.status(201).json({
						message: "Cvik byl úspěšně odstraněn",
					});
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
