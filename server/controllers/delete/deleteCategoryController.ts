import { Request, Response } from "express";
import { deleteCategoryModel } from "../../models/delete/deleteCategoryModel";
import { GenericModelReturnEnum } from "../../models/GenericModelReturn";
import { getHighestOrderNumberOfCategoryModel } from "../../models/get/getHighestOrderNumberOfCategoryModel";
import { getResidueCategoryModel } from "../../models/get/getResidueCategoryModel";
import { reorderCategoriesModel } from "../../models/move/reorderCategoriesModel";
import { transferExercisesModel } from "../../models/move/transferExercisesModel";

interface TransferExercisesProps {
	sportId: number;

	reorder: boolean;

	exercisesOfCategory: { exerciseId: number }[];
}

const transferExercises = async ({ props }: { props: TransferExercisesProps }): Promise<{ status: number; message: string }> => {
	const dbResidueCategoryResult = await getResidueCategoryModel({
		props: { sportId: props.sportId },
	});

	if (dbResidueCategoryResult.status === GenericModelReturnEnum.SUCCESS) {
		const categoryId = dbResidueCategoryResult.data ? dbResidueCategoryResult.data : 0;

		const dbHighestOrderNumberResult = await getHighestOrderNumberOfCategoryModel({
			props: { sportId: props.sportId, categoryId },
		});

		if (dbHighestOrderNumberResult.status === GenericModelReturnEnum.SUCCESS) {
			const highestOrderNumber = dbHighestOrderNumberResult.data ? dbHighestOrderNumberResult.data : 0;

			const dbTransferResult = await transferExercisesModel({
				props: {
					sportId: props.sportId,
					categoryId: categoryId,
					highestOrderNumber,
					exercisesOfCategory: props.exercisesOfCategory,
				},
			});

			if (dbTransferResult.status === GenericModelReturnEnum.SUCCESS) {
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
		const dbDeleteResult = await deleteCategoryModel({ props: { sportId, categoryId } });

		switch (dbDeleteResult.status) {
			case GenericModelReturnEnum.SUCCESS:
				if (reorderCategories.length > 0) {
					const dbReorderResult = await reorderCategoriesModel({ props: { sportId, reorderCategories } });

					switch (dbReorderResult.status) {
						case GenericModelReturnEnum.SUCCESS:
							const result = await transferExercises({ props: { sportId, reorder: true, exercisesOfCategory } });

							res.status(result.status).json({
								message: result.message,
							});

							break;
						default:
							console.error(dbReorderResult.message);
							res.status(500).json({ message: "Nastala chyba během přeuspořádávání kategorií" });
					}
				} else if (exercisesOfCategory.length > 0) {
					const result = await transferExercises({ props: { sportId, reorder: false, exercisesOfCategory } });

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
