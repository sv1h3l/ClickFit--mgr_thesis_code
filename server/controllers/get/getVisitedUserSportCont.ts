import { Request, Response } from "express";
import { getSportMod } from "../../models/get/getSportMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const getVisitedUserSportCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query;
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	const sportIdNumber = Number(sportId);
	if (isNaN(sportIdNumber)) {
		res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
		return;
	}

	const visitedUserId = Number(req.query.visitedUserId);

	if (!visitedUserId || visitedUserId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}
	const checkRes = await checkAuthorizationCont({ req, authToken, id: visitedUserId, checkAuthorizationCode: CheckAuthorizationCodeEnum.USER_VISIT });
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const dbResSport = await getSportMod({ sportId: sportIdNumber });

		const formattedSport = {
			userId: dbResSport.data?.user_id,
			userEmail: "",
			userName: "",
			canUserEdit: false,

			sportId: dbResSport.data?.sport_id,
			sportName: dbResSport.data?.sport_name,

			hasCategories: dbResSport.data?.has_categories,
			hasDifficulties: dbResSport.data?.has_difficulties,

			hasRecommendedValues: dbResSport.data?.has_recommended_values,
			hasRecommendedDifficultyValues: dbResSport.data?.has_recommended_difficulty_values,

			hasAutomaticPlanCreation: dbResSport.data?.has_automatic_plan_creation,

			unitCode: dbResSport.data?.unit_code,

			description: dbResSport.data?.description,
		};

		res.status(dbResSport.status).json({ message: dbResSport.message, data: formattedSport });
	} catch (error) {
		console.error("Chyba při získání sportů: ", error);
		res.status(500).json({ message: "Chyba při získání sportů.", data: [] });
	}
};
