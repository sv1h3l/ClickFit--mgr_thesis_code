import { Request, Response } from "express";
import { moveDefGraphMod } from "../../models/move/moveDefGraphMod";
import { moveGraphMod } from "../../models/move/moveGraphMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const moveGraphCont = async (req: Request, res: Response): Promise<void> => {
	const { primaryGraphId, secondaryGraphId, moveUp, isPrimaryGraphDef, isSecondaryGraphDef } = req.body;

	if (!primaryGraphId || primaryGraphId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID primárního grafu" });
		return;
	}

	if (!secondaryGraphId || secondaryGraphId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sekundárního grafu" });
		return;
	}

	try {
		/* FIXME předělat to, jestli uživatel může změnit hodnotu. 

		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}*/

		let movePrimaryGraph;
		if (isPrimaryGraphDef) {
			movePrimaryGraph = await moveDefGraphMod({ graphId: primaryGraphId, orderNumber: moveUp ? -1 : 1 });
		} else {
			movePrimaryGraph = await moveGraphMod({ graphId: primaryGraphId, orderNumber: moveUp ? -1 : 1 });
		}

		let moveSecondaryGraph;
		if (isSecondaryGraphDef) {
			moveSecondaryGraph = await moveDefGraphMod({ graphId: secondaryGraphId, orderNumber: moveUp ? 1 : -1 });
		} else {
			moveSecondaryGraph = await moveGraphMod({ graphId: secondaryGraphId, orderNumber: moveUp ? 1 : -1 });
		}

		if (movePrimaryGraph.status === GenEnum.FAILURE || moveSecondaryGraph.status === GenEnum.FAILURE) {
			res.status(GenEnum.FAILURE).json({ message: " Nastala chyba během změny pořadí grafů" });
		}

		res.status(GenEnum.SUCCESS).json({ message: "Pořadí grafů úspěšně změněno" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
