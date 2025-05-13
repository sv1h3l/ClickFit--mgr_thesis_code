import { Request, Response } from "express";
import { getGraphValuesMod } from "../../models/get/getGraphValuesMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

interface GraphValue {
	graphValueId: number;

	yAxisValue: number;
	xAxisValue: string;

	isGoal: boolean;

	orderNumber: number;
}

export const getVisitedUserGraphValuesCont = async (req: Request, res: Response): Promise<void> => {
	const { graphId, defaultGraph } = req.query;

	if (!graphId) {
		res.status(400).json({ message: "Nevalidní ID grafu" });
		return;
	}

	const graphIdNumber = Number(graphId);
	if (isNaN(graphIdNumber)) {
		res.status(400).json({ message: "ID grafu musí být číslo" });
		return;
	} else if (graphIdNumber < 1) {
		res.status(400).json({ message: "Nevalidní ID grafu" });
	}

	const defaultGraphBool = defaultGraph === "true";

	const visitedUserId = Number(req.query.visitedUserId);

	if (!visitedUserId || visitedUserId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}
	const checkRes = await checkAuthorizationCont({ req, id: visitedUserId, checkAuthorizationCode: CheckAuthorizationCodeEnum.USER_VISIT });
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const dbResDefGraphValues = await getGraphValuesMod({ graphId: graphIdNumber, defaultGraph: defaultGraphBool, userId: visitedUserId });

		let formattedValues: GraphValue[] = [];

		if (dbResDefGraphValues.status === GenEnum.SUCCESS && dbResDefGraphValues.data) {
			dbResDefGraphValues.data.forEach((value) => {
				const newGraph: GraphValue = {
					graphValueId: value.graph_value_id,
					yAxisValue: value.y_axis_value,
					xAxisValue: value.x_axis_value,
					isGoal: value.is_goal ? true : false,
					orderNumber: value.order_number,
				};

				formattedValues.push(newGraph);
			});
		}

		res.status(dbResDefGraphValues.status).json({ message: dbResDefGraphValues.message, data: formattedValues });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
