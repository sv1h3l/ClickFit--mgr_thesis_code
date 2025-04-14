import { Request, Response } from "express";
import { createDefaultGraphMod } from "../../models/create/createDefaultGraphMod";
import { createDefaultGraphOrderNumberMod } from "../../models/create/createDefaultGraphOrderNumberMod";
import { createGraphMod } from "../../models/create/createGraphMod";
import { getHighestDefaultGraphsOrderNumberModNEW } from "../../models/get/getHighestDefaultGraphsOrderNumberModNEW";
import { getHighestGraphsOrderNumberMod } from "../../models/get/getHighestGraphsOrderNumberMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

enum HelperTextCodeEnum {
	GRAPH_LABEL = 1,
	Y_AXIS_LABEL = 2,
	X_AXIS_LABEL = 3,
	UNIT = 6,
}

export const createGraphCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, graphLabel, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals, createDefGraph } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	let helperTexts: { [key: string]: string } = {};
	let error = false;

	if (graphLabel.length < 1) {
		helperTexts[HelperTextCodeEnum.GRAPH_LABEL] = "Název grafu nesmí být prázdný";
		error = true;
	} else if (graphLabel.length > 50) {
		helperTexts[HelperTextCodeEnum.GRAPH_LABEL] = "Název grafu nesmí mít víc než 50 znaků";
		error = true;
	} else {
		helperTexts[HelperTextCodeEnum.GRAPH_LABEL] = "";
	}

	if (yAxisLabel.length < 1) {
		helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL] = "Název osy Y nesmí být prázdný";
		error = true;
	} else if (yAxisLabel.length > 20) {
		helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL] = "Název osy Y nesmí mít víc než 20 znaků";
		error = true;
	} else {
		helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL] = "";
	}

	if (!hasDate && xAxisLabel.length < 1) {
		helperTexts[HelperTextCodeEnum.X_AXIS_LABEL] = "Název osy X nesmí být prázdný";
		error = true;
	} else if (!hasDate && xAxisLabel.length > 20) {
		helperTexts[HelperTextCodeEnum.X_AXIS_LABEL] = "Název osy X nesmí mít víc než 20 znaků";
		error = true;
	} else {
		helperTexts[HelperTextCodeEnum.X_AXIS_LABEL] = "";
	}

	if (unit.length > 5) {
		helperTexts[HelperTextCodeEnum.UNIT] = "Jednotka nesmí mít více než 5 znaků";
		error = true;
	} else {
		helperTexts[HelperTextCodeEnum.UNIT] = "";
	}

	if (error) {
		res.status(400).json({ message: "Předány nevalidní hodnoty", data: { helperTexts } });

		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		let highestOrderNumber = 0;
		const resHighestDefaultOrderNumber = await getHighestDefaultGraphsOrderNumberModNEW({ userId: checkRes.data?.userId! });
		const resHighestUserOrderNumber = await getHighestGraphsOrderNumberMod({ userId: checkRes.data?.userId! });

		highestOrderNumber = resHighestDefaultOrderNumber.data?.highestOrderNumber! + resHighestUserOrderNumber.data?.highestOrderNumber! + 1;

		let dbResult;
		let defaultGraphOnId = undefined;

		if (createDefGraph) {
			dbResult = await createDefaultGraphMod({ sportId, graphLabel, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals });
			defaultGraphOnId = await createDefaultGraphOrderNumberMod({ userId: checkRes.data?.userId!, graphId: dbResult.data?.graphId!, highestOrderNumber });
		} else {
			dbResult = await createGraphMod({ sportId, userId: checkRes.data?.userId!, graphLabel, orderNumber: highestOrderNumber, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals });
		}

		res.status(dbResult.status).json({ message: dbResult.message, data: { graphId: dbResult.data?.graphId, defaultGraphOnId: defaultGraphOnId?.data?.defaultGraphOrderNumberId, orderNumber: highestOrderNumber } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
