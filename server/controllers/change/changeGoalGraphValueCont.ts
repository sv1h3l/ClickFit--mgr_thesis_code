import { Request, Response } from "express";
import { changeGoalGraphValueMod } from "../../models/change/changeGoalGraphValueMod";

export const changeGoalGraphValueCont = async (req: Request, res: Response): Promise<void> => {
	const { graphValueId, isGoal } = req.body;

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

		const dbResult = await changeGoalGraphValueMod({ graphValueId, isGoal });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
