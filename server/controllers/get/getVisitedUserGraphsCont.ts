import { Request, Response } from "express";
import { createDefaultGraphOrderNumberMod } from "../../models/create/createDefaultGraphOrderNumberMod";
import { getDefaultGraphsMod } from "../../models/get/getDefaultGraphsMod";
import { getDefaultGraphOrderNumberMod } from "../../models/get/getDefaultGraphsOrderNumbersMod";
import { getHighestDefaultGraphsOrderNumberModNEW } from "../../models/get/getHighestDefaultGraphsOrderNumberModNEW";
import { getHighestGraphsOrderNumberMod } from "../../models/get/getHighestGraphsOrderNumberMod";
import { getUserGraphsMod } from "../../models/get/getUserGraphsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { Graph } from "./getGraphsCont";
import { checkAuthorizationCont, CheckAuthorizationCodeEnum } from "../residue/checkAuthorizationCont";

export const getVisitedUserGraphsCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query;

	if (!sportId) {
		res.status(400).json({ message: "Nevalidní ID sportu" });
		return;
	}

	const sportIdNumber = Number(sportId);
	if (isNaN(sportIdNumber)) {
		res.status(400).json({ message: "ID sportu musí být číslo" });
		return;
	} else if (sportIdNumber < 1) {
		res.status(400).json({ message: "Nevalidní ID sportu" });
	}

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
		const dbGetDefaultGraphsRes = await getDefaultGraphsMod({ sportId: sportIdNumber });

		let highestOrderNumber = 0;
		const resHighestDefaultOrderNumber = await getHighestDefaultGraphsOrderNumberModNEW({ userId: visitedUserId });
		const resHighestUserOrderNumber = await getHighestGraphsOrderNumberMod({ userId: visitedUserId });

		highestOrderNumber = resHighestDefaultOrderNumber.data?.highestOrderNumber! + resHighestUserOrderNumber.data?.highestOrderNumber! + 1;

		let formattedGraphs: Graph[] = [];

		if (dbGetDefaultGraphsRes.status === 200 && dbGetDefaultGraphsRes.data) {
			const graphPromises = dbGetDefaultGraphsRes.data.map(async (graph) => {
				const dbGetDefaultGraphOrderNumberRes = await getDefaultGraphOrderNumberMod({ userId: visitedUserId, graphId: graph.graph_id });

				let newDefaultGraphOnId;
				if (dbGetDefaultGraphOrderNumberRes.status === GenEnum.NOT_FOUND) {
					newDefaultGraphOnId = await createDefaultGraphOrderNumberMod({ userId: visitedUserId, graphId: graph.graph_id, highestOrderNumber });

					highestOrderNumber = highestOrderNumber + 1;
				}

				const newGraph: Graph = {
					graphId: newDefaultGraphOnId?.data ? newDefaultGraphOnId.data.defaultGraphOrderNumberId : graph.graph_id,
					graphLabel: graph.graph_label,
					hasDate: graph.has_date,
					orderNumber: newDefaultGraphOnId?.data ? highestOrderNumber - 1 : dbGetDefaultGraphOrderNumberRes.data?.order_number!,
					defaultGraphOrderNumberId: dbGetDefaultGraphOrderNumberRes.data?.default_graph_order_number_id,
					yAxisLabel: graph.y_axis_label,
					xAxisLabel: graph.x_axis_label,
					unit: graph.unit,
					hasGoals: graph.has_goals,
				};

				return newGraph;
			});

			// Počkej na všechny promisy, než odešleš odpověď
			formattedGraphs = await Promise.all(graphPromises);
		}

		const dbResUserGraphs = await getUserGraphsMod({ sportId: sportIdNumber, userId: visitedUserId });
		if (dbResUserGraphs.status === 200 && dbResUserGraphs.data) {
			dbResUserGraphs.data.forEach((graph) => {
				const newGraph: Graph = {
					graphId: graph.graph_id,
					graphLabel: graph.graph_label,
					hasDate: graph.has_date,
					orderNumber: graph.order_number,
					defaultGraphOrderNumberId: undefined,
					hasGoals: graph.has_goals,
					unit: graph.unit,
					yAxisLabel: graph.y_axis_label,
					xAxisLabel: graph.x_axis_label,
				};

				formattedGraphs.push(newGraph);
			});
		}

		formattedGraphs.sort((a, b) => b.orderNumber - a.orderNumber);

		res.status(200).json({ message: "Grafy předány", data: formattedGraphs });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
