import { Request, Response } from "express";
import { getCategoriesAndExercises } from "../../models/get/getCategoriesAndExercises";
import { getExercises } from "../../models/get/getExercises";

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
		const categories = await getCategoriesAndExercises(sportIdNumber);

		const exercises = await getExercises(sportIdNumber);

		if (categories.length > 0) {
			const formattedCategories = categories
				.map((category) => {
					// Filtrujeme a setřídíme všechny cviky, které mají stejné categoryId
					const categoryExercises = exercises.filter((exercise) => exercise.category_id === category.category_id).sort((a, b) => a.order_number - b.order_number); // Seřazení cviků

					return {
						categoryId: category.category_id,
						categoryName: category.category_name,
						orderNumber: category.order_number,

						// Přidáme seřazené cviky do každé kategorie
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
				})
				.sort((a, b) => (a.orderNumber === 0 ? 1 : b.orderNumber === 0 ? -1 : a.orderNumber - b.orderNumber)); // Seřazení kategorií

			res.status(200).json({ message: "Kategorie a cviky úspěšně předány.", data: formattedCategories });
		} else {
			res.status(200).json({ message: "Žádné kategorie nenalezeny.", data: [] }); // TODO: opravit status kód i u getSportsController
		}
	} catch (error) {
		console.error("Chyba při získání kategorií a cviků: ", error);
		res.status(500).json({ message: "Chyba při získání kategorií a cviků.", data: [] });
	}
};
