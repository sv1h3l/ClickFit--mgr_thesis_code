import { Request, Response } from "express";
import { getSports } from "../models/getSports";
import { getUserIdFromEmail } from "../models/getUserIdFromEmail";

export const getSportsController = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.query as { email: string };

	if (!email) {
		res.status(400).json({ message: "Chybějící email", data: [] });
		return;
	}

	try {
		const userId = await getUserIdFromEmail(email);
		const sports = await getSports(userId); // Získáme sporty

		if (sports.length > 0) {
			// Mapujeme sport z databázového formátu (snake_case) na formát camelCase
			const formattedSports = sports.map((sport) => ({
				userId: sport.user_id,
				userEmail: email,
				userName: sport.first_name + " " + sport.last_name,

				sportId: sport.sport_id,
				sportName: sport.sport_name,

				hasCategories: sport.has_categories,
				hasDifficulties: sport.has_categories,

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
