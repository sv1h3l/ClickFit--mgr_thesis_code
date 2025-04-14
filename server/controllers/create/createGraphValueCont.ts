import { Request, Response } from "express";
import { createGraphValueMod } from "../../models/create/createGraphValueMod";
import { getHighestGraphValuesOrderNumberMod } from "../../models/get/getHighestGraphValuesOrderNumberMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const createGraphValueCont = async (req: Request, res: Response): Promise<void> => {
	const { graphId, yAxisValue, xAxisValue, isGoal, isDefaultGraphValue } = req.body;

	if (!graphId || graphId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID grafu" });
		return;
	}

	if (!yAxisValue || !xAxisValue) {
		res.status(400).json({ message: "Hodnoty nesmí být prázdné" });
		return;
	}

	try {
		/* FIXME předělat to, jestli uživatel může přidat hodnotu. 

		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}*/

		/* TODO udělat to i pro default grafy */

		const resHighestUserOrderNumber = await getHighestGraphValuesOrderNumberMod({ userId: 2, graphId, isDefaultGraphValue });

		let highestOrderNumber = 1;
		if (resHighestUserOrderNumber.status === GenEnum.SUCCESS && resHighestUserOrderNumber.data?.highestOrderNumber) highestOrderNumber = resHighestUserOrderNumber.data?.highestOrderNumber + 1;

		const dbResult = await createGraphValueMod({ graphId, userId: 2, yAxisValue, xAxisValue, isGoal, isDefaultGraphValue, orderNumber: highestOrderNumber });

		res.status(dbResult.status).json({ message: dbResult.message, data: { graphValueId: dbResult.data?.graphValueId, orderNumber: highestOrderNumber } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
