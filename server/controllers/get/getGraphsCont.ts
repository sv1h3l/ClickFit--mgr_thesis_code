import { Request, Response } from "express";
import { createDefaultGraphOrderNumberMod } from "../../models/create/createDefaultGraphOrderNumberMod";
import { getDefaultGraphsMod } from "../../models/get/getDefaultGraphsMod";
import { getDefaultGraphOrderNumberMod } from "../../models/get/getDefaultGraphsOrderNumbersMod";
import { getHighestDefaultGraphsOrderNumberMod } from "../../models/get/getHighestDefaultGraphsOrderNumberMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

interface GraphValue {
	graphValueId: number;

	firstValue: number;
	secondValue: string;
}

export interface Graph {
	graphId: number;

	graphLabel: string;
	hasDate?: boolean;

	orderNumber: number;
	defaultGraphOrderNumberId?: number;

	yAxisLabel: string;
	xAxisLabel: string;

	graphValue: GraphValue[];
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
		const resHighestOrderNumber = await getHighestDefaultGraphsOrderNumberMod({ userId: userAtrs.data?.userId! });
		highestOrderNumber = resHighestOrderNumber.data?.highestOrderNumber! + 1;

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
					graphValue: [],
				};

				return newGraph;
			});

			// Počkej na všechny promisy, než odešleš odpověď
			formattedGraphs = await Promise.all(graphPromises);
		}

		res.status(dbGetDefaultGraphsRes.status).json({ message: dbGetDefaultGraphsRes.message, data: formattedGraphs });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
