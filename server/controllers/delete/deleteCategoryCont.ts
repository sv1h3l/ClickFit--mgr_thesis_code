import { Request, Response } from "express";
import { deleteCategoryMod } from "../../models/delete/deleteCategoryMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { getHighestOrderNumberOfCategoryMod } from "../../models/get/getHighestOrderNumberOfCategoryMod";
import { getResidueCategoryMod } from "../../models/get/getResidueCategoryMod";
import { reorderCategoriesMod } from "../../models/move/reorderCategoriesMod";
import { transferExercisesMod } from "../../models/move/transferExercisesMod";

interface TransferExercisesProps {
	sportId: number;

	reorder: boolean;

	exercisesOfCategory: { exerciseId: number }[];
}

const deleteCategoryCont = async ({ props }: { props: TransferExercisesProps }): Promise<{ status: number; message: string }> => {
	const dbResidueCategoryResult = await getResidueCategoryMod({
		props: { sportId: props.sportId },
	});

	if (dbResidueCategoryResult.status === GenEnum.SUCCESS) {
		const categoryId = dbResidueCategoryResult.data ? dbResidueCategoryResult.data : 0;

		const dbHighestOrderNumberResult = await getHighestOrderNumberOfCategoryMod({
			props: { sportId: props.sportId, categoryId },
		});

		if (dbHighestOrderNumberResult.status === GenEnum.SUCCESS) {
			const highestOrderNumber = dbHighestOrderNumberResult.data ? dbHighestOrderNumberResult.data : 0;

			const dbTransferResult = await transferExercisesMod({
				props: {
					sportId: props.sportId,
					categoryId: categoryId,
					highestOrderNumber,
					exercisesOfCategory: props.exercisesOfCategory,
				},
			});

			if (dbTransferResult.status === GenEnum.SUCCESS) {
				if (props.reorder) {
					return { status: dbTransferResult.status, message: "Kategorie byla úspěšně odstraněna, cviky přesunuty do kategorie 'Ostatní' a následující kategorie přeuspořádány" };
				} else {
					return { status: dbTransferResult.status, message: "Kategorie byla úspěšně odstraněna a cviky přesunuty do kategorie 'Ostatní'" };
				}
			} else {
				return { status: dbTransferResult.status, message: dbTransferResult.message ? dbTransferResult.message : "" };
			}
		}
		return { status: dbHighestOrderNumberResult.status, message: dbHighestOrderNumberResult.message ? dbHighestOrderNumberResult.message : "" };
	}
	return { status: dbResidueCategoryResult.status, message: dbResidueCategoryResult.message ? dbResidueCategoryResult.message : "" };
};

export const deleteCategoryController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, categoryId, exercisesOfCategory, reorderCategories } = req.body;

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	} else if (!categoryId) {
		res.status(400).json({ message: "Předáno nevalidní ID kategorie." });
		return;
	}

	try {
		const dbDeleteResult = await deleteCategoryMod({ props: { sportId, categoryId } });

		switch (dbDeleteResult.status) {
			case GenEnum.SUCCESS:
				if (reorderCategories.length > 0) {
					const dbReorderResult = await reorderCategoriesMod({ props: { sportId, reorderCategories } });

					switch (dbReorderResult.status) {
						case GenEnum.SUCCESS:
							const result = await deleteCategoryCont({ props: { sportId, reorder: true, exercisesOfCategory } });

							res.status(result.status).json({
								message: result.message,
							});

							break;
						default:
							console.error(dbReorderResult.message);
							res.status(500).json({ message: "Nastala chyba během přeuspořádávání kategorií" });
					}
				} else if (exercisesOfCategory.length > 0) {
					const result = await deleteCategoryCont({ props: { sportId, reorder: false, exercisesOfCategory } });

					res.status(result.status).json({
						message: result.message,
					});
				} else {
					res.status(201).json({
						message: "Kategorie byla úspěšně odstraněna",
					});
				}
				break;
			default:
				console.error(dbDeleteResult.message);

				res.status(500).json({ message: "Nastala chyba během odstraňování kategorie" });
				break;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
