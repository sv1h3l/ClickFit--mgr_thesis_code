import { Request, Response } from "express";
import { createExerciseMod, ExerciseCreationStatus } from "../../models/create/createExerciseMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { getHighestOrderNumberOfCategoryMod } from "../../models/get/getHighestOrderNumberOfCategoryMod";
import { getHighestOrderNumberWithoutCategoriesMod } from "../../models/get/getHighestOrderNumberWithoutCategoriesMod";
import { getResidueCategoryMod } from "../../models/get/getResidueCategoryMod";
import { getEasiestDifficultyIdMod as getEasiestDifficultyIdMod } from "../../models/get/getEasiestDifficultyIdMod";
import { getDefaultUnitCodeMod } from "../../models/get/getDefaultUnitCodeMod";

export const createExerciseCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseName, categoryId } = req.body;

	if (!exerciseName) {
		res.status(400).json({ message: "Název cviku nesmí být prázdný" });
		return;
	}

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID." });
		return;
	}

	try {
		let localCategoryId;

		if (categoryId === -1) {
			const dbCategoryId = await getResidueCategoryMod({ props: { sportId } });
			localCategoryId = dbCategoryId.data;
		} else localCategoryId = categoryId;

		const highestOrderNumber = await getHighestOrderNumberOfCategoryMod({ props: { sportId, categoryId: localCategoryId } });
		const highestOrderNumberWithoutCategories = await getHighestOrderNumberWithoutCategoriesMod({ sportId });
		const getEasiestDifficultyId = await getEasiestDifficultyIdMod({ sportId });
		const getDefaultUnitCode = await getDefaultUnitCodeMod({ sportId });


		if ([highestOrderNumber, highestOrderNumberWithoutCategories, getEasiestDifficultyId].every((item) => item.status === GenEnum.SUCCESS)) {
			const dbRes = await createExerciseMod({
				props: { sportId, exerciseName, sportDifficultyId: getEasiestDifficultyId.data!, orderNumber: highestOrderNumber.data!, orderNumberWithoutCategories: highestOrderNumberWithoutCategories.data!, categoryId: localCategoryId, unitCode: getDefaultUnitCode.data! },
			});

			switch (dbRes.status) {
				case ExerciseCreationStatus.SUCCESS:
					res.status(201).json({
						message: "Cvik byl úspěšně vytvořen",
						data: {
							exerciseId: dbRes.exerciseId,
							difficultyId: getEasiestDifficultyId.data,
							orderNumber: highestOrderNumber.data,
							orderNumberWithoutCategories: highestOrderNumberWithoutCategories.data,
							unitCode: getDefaultUnitCode.data!
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
		} else {
			if (highestOrderNumber.status !== GenEnum.SUCCESS) {
				res.status(highestOrderNumber.status).json({ message: highestOrderNumber.message });
			} else {
				res.status(highestOrderNumberWithoutCategories.status).json({ message: highestOrderNumberWithoutCategories.message });
			}
			return;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
	}
};
