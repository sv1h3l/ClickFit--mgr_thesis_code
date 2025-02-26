import { Request, Response } from "express";
import { getCategoriesAndExercises } from "../models/getCategoriesAndExercises";
import { getExercises } from "../models/getExercises";

export const getCategoriesAndExercisesController = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query as { sportId: string };

	if (!sportId) {
		res.status(400).json({ message: "Chybějící ID sportu", data: [] });
		return;
	}

	const sportIdNumber = Number(sportId);

	if (isNaN(sportIdNumber)) {
		// Kontrola, jestli to je validní číslo
		res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
		return;
	}

	try {
		const categories = await getCategoriesAndExercises(sportIdNumber); // Získáme sporty

		const exercises = await getExercises(sportIdNumber); // Získáme sporty

		console.log(exercises)

		if (categories.length > 0) {
			const formattedCategories = categories.map((category) => {
				// Filtrujeme všechny cviky, které mají stejné categoryId
				const categoryExercises = exercises.filter((exercise) => exercise.category_id === category.category_id);

				return {
					categoryId: category.category_id,
					categoryName: category.category_name,
					orderNumber: category.order_number,

					// Přidáme cvičení do každé kategorie
					exercises: categoryExercises.map((exercise) => ({
						exerciseId: exercise.exercise_id,
						categoryId: exercise.category_id,
						sportDifficultyId: exercise.sport_difficulty_id,
						exerciseName: exercise.name,
						orderNumber: exercise.order_number,
						description: exercise.description,
						youtubeLink: exercise.youtube_link,
					})),
				};
			});

			console.log(formattedCategories)

			res.status(200).json({ message: "Kategorie a cviky úspěšně předány.", data: formattedCategories });
		} else {
			res.status(200).json({ message: "Žádné kategorie nenalezeny.", data: [] }); // TODO: opravit status kód i u getSportsController
		}
	} catch (error) {
		console.error("Chyba při získání kategorií a cviků: ", error);
		res.status(500).json({ message: "Chyba při získání kategorií a cviků.", data: [] });
	}
};
