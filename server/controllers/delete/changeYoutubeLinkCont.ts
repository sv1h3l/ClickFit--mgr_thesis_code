import { Request, Response } from "express";
import { changeYoutubeLinkMod } from "../../models/change/changeYoutubeLinkMod";

export const changeYoutubeLinkCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, youtubeLink } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (!exerciseId || exerciseId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku." });
		return;
	}

	try {
		const dbResult = await changeYoutubeLinkMod({ sportId, exerciseId, youtubeLink });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
