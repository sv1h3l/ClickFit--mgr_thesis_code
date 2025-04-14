import { Request, Response } from "express";
import { hideDefGraphMod } from "../../models/move/hideDefGraphMod";

export const hideDefaultGraphCont = async (req: Request, res: Response): Promise<void> => {
	const { defGraphId, sportId, orderNumber } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!defGraphId || defGraphId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID výchozího grafu" });
		return;
	}

	try {
		/* FIXME předělat to, jestli uživatel může změnit hodnotu. 

		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}*/

		const resHideDefGraph = await hideDefGraphMod({ defGraphId, sportId, orderNumber });

		res.status(resHideDefGraph.status).json({ message: resHideDefGraph.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
