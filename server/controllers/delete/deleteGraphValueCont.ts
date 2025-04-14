import { Request, Response } from "express";
import { deleteGraphValueMod } from "../../models/delete/deleteGraphValueMod";
import { reorderGraphValuesMod } from "../../models/move/reorderGraphValuesMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const deleteGraphValueCont = async (req: Request, res: Response): Promise<void> => {
	const { graphId, graphValueId, orderNumber } = req.body;

	if (!graphId || graphId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID grafu" });
		return;
	}

	if (!graphValueId || graphValueId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID hodnoty grafu" });
		return;
	}

	try {
		/* FIXME předělat to, jestli uživatel může přidat hodnotu. 

		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}*/

		const dbResult = await deleteGraphValueMod({ graphValueId });

		if (dbResult.status === GenEnum.SUCCESS) {
			reorderGraphValuesMod({ graphId, orderNumber });
		}

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
