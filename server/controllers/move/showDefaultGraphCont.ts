import { Request, Response } from "express";
import { hideDefGraphMod } from "../../models/move/hideDefGraphMod";
import { showDefGraphMod } from "../../models/move/showDefGraphMod";

export const showDefaultGraphCont = async (req: Request, res: Response): Promise<void> => {
	const { defGraphId, orderNumber } = req.body;

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

		const resHideDefGraph = await showDefGraphMod({ defGraphId, orderNumber });

		res.status(resHideDefGraph.status).json({ message: resHideDefGraph.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
