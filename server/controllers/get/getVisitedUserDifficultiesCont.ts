import { Request, Response } from "express";
import { getDifficultiesMod } from "../../models/get/getDifficultiesMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const getVisitedUserDifficultiesCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query;

	if (!sportId) {
		res.status(400).json({ message: "Chybějící ID sportu", data: [] });
		return;
	}

	const sportIdNumber = Number(sportId);
	if (isNaN(sportIdNumber)) {
		res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
		return;
	}

	const authToken = req.headers["authorization"]?.split(" ")[1];
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
		const dbRes = await getDifficultiesMod({ sportId: sportIdNumber });

		let difficulties;

		if (dbRes.data && dbRes.data.length > 0) {
			difficulties = dbRes.data
				.map((difficulty) => ({
					sportDifficultyId: difficulty.sport_difficulty_id,
					difficultyName: difficulty.difficulty_name,
					orderNumber: difficulty.order_number,
				}))
				.sort((a, b) => a.orderNumber - b.orderNumber);
		}

		res.status(dbRes.status).json({ message: dbRes.message, data: difficulties });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
