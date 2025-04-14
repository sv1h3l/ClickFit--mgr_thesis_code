import { Request, Response } from "express";
import { moveGraphValueMod } from "../../models/move/moveGraphValueMod";

export const moveGraphValueCont = async (req: Request, res: Response): Promise<void> => {
	const { primaryGraphValueId, secondaryGraphValueId, moveUp } = req.body;

	if (!primaryGraphValueId || primaryGraphValueId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID primárního záznamu grafu" });
		return;
	}

	if (!secondaryGraphValueId || secondaryGraphValueId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sekundárního záznamu grafu" });
		return;
	}

	try {
		/* FIXME předělat to, jestli uživatel může změnit hodnotu. 

		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}*/

		const dbResult = await moveGraphValueMod({ firstGraphValueId: moveUp ? primaryGraphValueId : secondaryGraphValueId, secondGraphValueId: moveUp ? secondaryGraphValueId : primaryGraphValueId });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
