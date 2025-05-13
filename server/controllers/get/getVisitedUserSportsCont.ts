import { Request, Response } from "express";
import { getSportsMod } from "../../models/get/getSportsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const getVisitedUserSportsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	const visitedUserId = Number(req.query.visitedUserId);

	if (!visitedUserId || visitedUserId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, authToken, id: visitedUserId, checkAuthorizationCode: CheckAuthorizationCodeEnum.USER_VISIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const sports = await getSportsMod(visitedUserId); // Získáme sporty

		if (sports.length > 0) {
			// Mapujeme sport z databázového formátu (snake_case) na formát camelCase
			const formattedSports = sports.map((sport) => ({
				userId: sport.user_id,
				userEmail: "",
				userName: sport.first_name + " " + sport.last_name,
				canUserEdit: sport.user_id === visitedUserId,

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
