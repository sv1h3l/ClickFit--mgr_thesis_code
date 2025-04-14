import { Request, Response } from "express";
import { createDefaultGraphOrderNumberMod } from "../../models/create/createDefaultGraphOrderNumberMod";
import { getDefaultGraphsMod } from "../../models/get/getDefaultGraphsMod";
import { getDefaultGraphOrderNumberMod } from "../../models/get/getDefaultGraphsOrderNumbersMod";
import { getHighestDefaultGraphsOrderNumberModNEW } from "../../models/get/getHighestDefaultGraphsOrderNumberModNEW";
import { getHighestGraphsOrderNumberMod } from "../../models/get/getHighestGraphsOrderNumberMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { getUserGraphsMod } from "../../models/get/getUserGraphsMod";
import { GenEnum } from "../../utilities/GenResEnum";

export interface Graph {
	graphId: number;

	graphLabel: string;
	orderNumber: number;
	unit?: string;

	hasDate?: boolean;
	defaultGraphOrderNumberId?: number;

	hasGoals?: boolean;

	yAxisLabel: string;
	xAxisLabel: string;
}

export const getGraphsCont = async (req: Request, res: Response): Promise<void> => {
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

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbGetDefaultGraphsRes = await getDefaultGraphsMod({ sportId: sportIdNumber });

		let highestOrderNumber = 0;
		const resHighestDefaultOrderNumber = await getHighestDefaultGraphsOrderNumberModNEW({ userId: userAtrs.data?.userId! });
		const resHighestUserOrderNumber = await getHighestGraphsOrderNumberMod({ userId: userAtrs.data?.userId! });

		highestOrderNumber = resHighestDefaultOrderNumber.data?.highestOrderNumber! + resHighestUserOrderNumber.data?.highestOrderNumber! + 1;

		let formattedGraphs: Graph[] = [];

		if (dbGetDefaultGraphsRes.status === 200 && dbGetDefaultGraphsRes.data) {
			const graphPromises = dbGetDefaultGraphsRes.data.map(async (graph) => {
				const dbGetDefaultGraphOrderNumberRes = await getDefaultGraphOrderNumberMod({ userId: userAtrs.data?.userId!, graphId: graph.graph_id });

				let newDefaultGraphOnId;
				if (dbGetDefaultGraphOrderNumberRes.status === GenEnum.NOT_FOUND) {
					newDefaultGraphOnId = await createDefaultGraphOrderNumberMod({ userId: userAtrs.data?.userId!, graphId: graph.graph_id, highestOrderNumber });

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

		const dbResUserGraphs = await getUserGraphsMod({ sportId: sportIdNumber, userId: userAtrs.data.userId });
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

		formattedGraphs.sort((a, b) => a.orderNumber - b.orderNumber);

		res.status(200).json({ message: "Grafy předány", data: formattedGraphs });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
