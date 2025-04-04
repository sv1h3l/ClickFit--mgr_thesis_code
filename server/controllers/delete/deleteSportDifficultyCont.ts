import { Request, Response } from "express";
import { changeExercisesDifficultyMod } from "../../models/change/changeExercisesDifficultyMod";
import { deleteSportDifficultyMod } from "../../models/delete/deleteSportDifficultyMod";
import { getSportDifficultyNeighbourMod } from "../../models/get/getSportDifficultyNeighbourMod";
import { reorderSportDifficultiesMod } from "../../models/move/reorderSportDifficultiesMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const deleteSportDifficultyCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, sportDifficultyId, orderNumber } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!sportDifficultyId || sportDifficultyId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID obtížnosti" });
		return;
	}

	const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}
	try {
		const resSportDifficultyNeighbour = await getSportDifficultyNeighbourMod({ sportId, orderNumber });

		if (resSportDifficultyNeighbour.status === GenEnum.FAILURE || !resSportDifficultyNeighbour.data) {
			res.status(resSportDifficultyNeighbour.status).json({ message: resSportDifficultyNeighbour.message });
			return;
		}

		const resExercisesDifficulty = await changeExercisesDifficultyMod({ sportId, sportDifficultyId, newSportDifficultyId: resSportDifficultyNeighbour.data });

		if (resExercisesDifficulty.status === GenEnum.FAILURE) {
			res.status(resExercisesDifficulty.status).json({ message: resExercisesDifficulty.message });
			return;
		}

		const dbDeleteSportDifficultyResult = await deleteSportDifficultyMod({ sportId, sportDifficultyId });

		if (dbDeleteSportDifficultyResult.status === GenEnum.SUCCESS) {
			await reorderSportDifficultiesMod({ sportId, orderNumber });
		}

		res.status(dbDeleteSportDifficultyResult.status).json({ message: dbDeleteSportDifficultyResult.message, data: resSportDifficultyNeighbour.data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
