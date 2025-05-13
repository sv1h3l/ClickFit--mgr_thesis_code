import { Request, Response } from "express";
import { getSharedSportsMod } from "../../models/get/getSharedSportsMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export interface SharedSport {
	sharedSportId: number;
	sportId: number;
	userId: number;
	authorId: number;
}

export const getSharedSportsCont = async (req: Request, res: Response): Promise<void> => {
	const userId = Number(req.query.visitedUserId);

	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	if (!userId || userId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}

	const dbUserAtr = await getUserAtrFromAuthTokenMod({ req, authToken });
	if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
		res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
		return;
	}

	try {
		const sports = await getSharedSportsMod({ authorId: dbUserAtr.data.userId, userId });

		if (sports.length > 0) {
			const formattedSports = sports.map((sport) => ({
				sharedSportId: sport.shared_sport_id,
				sportId: sport.sport_id,
				authorId: sport.author_id,
				userId: sport.user_id,
			}));

			res.status(200).json({ message: "Sdílené sporty úspěšně předány.", data: formattedSports });
		} else {
			res.status(200).json({ message: "Žádné sdílené sporty nenalezeny." });
		}
	} catch (error) {
		console.error("Chyba při získání sdílených sportů: ", error);
		res.status(500).json({ message: "Chyba při získání sdílených sportů." });
	}
};
