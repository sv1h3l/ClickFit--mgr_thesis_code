import { Request, Response } from "express";
import { getSportsMod } from "../../models/get/getSportsMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const getSportsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	const dbUserAtr = await getUserAtrFromAuthTokenMod({ req, authToken });
	if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
		res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
		return;
	}

	try {
		const sports = await getSportsMod(dbUserAtr.data.userId); // Získáme sporty

		if (sports.length > 0) {
			// Mapujeme sport z databázového formátu (snake_case) na formát camelCase
			const formattedSports = sports.map((sport) => ({
				userId: sport.user_id,
				userEmail: dbUserAtr.data?.userEmail,
				userName: sport.first_name + " " + sport.last_name,
				canUserEdit: sport.user_id === dbUserAtr.data?.userId,

				sportId: sport.sport_id,
				sportName: sport.sport_name,

				hasCategories: sport.has_categories,
				hasDifficulties: sport.has_difficulties,

				hasRecommendedValues: sport.has_recommended_values,
				hasRecommendedDifficultyValues: sport.has_recommended_difficulty_values,

				hasAutomaticPlanCreation: sport.has_automatic_plan_creation,

				unitCode: sport.unit_code,

				description: sport.description,
			}));

			res.status(200).json({ message: "Sporty úspěšně předány.", data: formattedSports });
		} else {
			res.status(200).json({ message: "Žádné sporty nenalezeny.", data: [] });
		}
	} catch (error) {
		console.error("Chyba při získání sportů: ", error);
		res.status(500).json({ message: "Chyba při získání sportů.", data: [] });
	}
};
