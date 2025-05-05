import { Request, Response } from "express";
import { deleteAllGraphValuesMod } from "../../models/delete/deleteAllGraphValuesMod";
import { deleteDefGraphOrderNumbersMod } from "../../models/delete/deleteDefGraphOrderNumbersMod";
import { deleteGraphMod } from "../../models/delete/deleteGraphMod";
import { getAllDefGraphOrderNumbersMod } from "../../models/get/getAllDefGraphOrderNumbersMod";
import { reorderGraphsMod } from "../../models/move/reorderGraphsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const deleteGraphCont = async (req: Request, res: Response): Promise<void> => {
	const { graphId, sportId, isDefGraph, orderNumber } = req.body;

	if (!graphId || graphId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID grafu" });
		return;
	}

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	const checkRes = await checkAuthorizationCont({ req, id: graphId, checkAuthorizationCode: CheckAuthorizationCodeEnum.GRAPH_EDIT });
	if (checkRes.status !== GenEnum.SUCCESS && checkRes.data) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		let resDefGraphOrderNumbers = null;
		if (isDefGraph) resDefGraphOrderNumbers = await getAllDefGraphOrderNumbersMod({ graphId });

		const dbResult = await deleteGraphMod({ graphId, isDefGraph });

		if (dbResult.status === GenEnum.SUCCESS ) {
			deleteAllGraphValuesMod({ graphId, isDefGraph });

			if (isDefGraph) {
				deleteDefGraphOrderNumbersMod({ graphId });

				if (resDefGraphOrderNumbers) {
					resDefGraphOrderNumbers.data?.forEach((graph) => {
						if (graph.order_number !== 0) {
							reorderGraphsMod({ orderNumber: graph.order_number, userId: graph.user_id });
						}
					});
				}
			} else {
				reorderGraphsMod({ orderNumber, userId: checkRes.data?.userId! });
			}
		}

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
