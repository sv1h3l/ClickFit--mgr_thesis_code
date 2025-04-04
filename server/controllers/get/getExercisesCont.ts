import { Request, Response } from "express";
import { getExercisesMod } from "../../models/get/getExercisesMod";

export const getExercisesCont = async (req: Request, res: Response): Promise<void> => {
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
		const exercises = await getExercisesMod(sportIdNumber); // Získáme sporty

		if (exercises.length > 0) {
			// Mapujeme sport z databázového formátu (snake_case) na formát camelCase
			const formattedExercises = exercises
				.map((exercise) => ({
					exerciseId: exercise.exercise_id,
					categoryId: exercise.category_id,
					sportDifficultyId: exercise.sport_difficulty_id,

					exerciseName: exercise.name,
					orderNumber: exercise.order_number,
					orderNumberWithoutCategories: exercise.order_number_without_categories,

					series: exercise.series,
					repetitions: exercise.repetitions,
					burden: exercise.burden,
					unitCode: exercise.unit_code,

					description: exercise.description,
					youtubeLink: exercise.youtube_link,
				}))
				.sort((a, b) => a.orderNumberWithoutCategories - b.orderNumberWithoutCategories);

			res.status(200).json({ message: "Cviky úspěšně předány.", data: formattedExercises });
		} else {
			res.status(200).json({ message: "Žádné cviky nenalezeny.", data: [] }); // TODO: opravit kód i u getSportsController
		}
	} catch (error) {
		console.error("Chyba při získání cviků: ", error);
		res.status(500).json({ message: "Chyba při získání cviků.", data: [] });
	}
};
