import { Request, Response } from "express";
import { getSportDetailLabsMod } from "../../models/get/getSportDetailLabsMod";
import { getSportDetailValsMod } from "../../models/get/getSportDetailValsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { createMissingSportDetailValsMod } from "./../../models/create/createMissingSportDetailValsMod";

export const getSportDetailLabsAndValsCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query;

	const sportIdNumber = Number(sportId);
	if (isNaN(sportIdNumber)) {
		res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
		return;
	}

	if (!sportId || sportIdNumber === -1) {
		res.status(400).json({ message: "Chybějící ID sportu", data: [] });
		return;
	}

	const authToken = req.headers["authorization"]?.split(" ")[1];

	const checkSportView = await checkAuthorizationCont({ req, id: sportIdNumber, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_VIEW, authToken }); // TODO předělat na SPORT_VIEW
	const checkSportEdit = await checkAuthorizationCont({ req, id: sportIdNumber, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT, authToken }); // TODO předělat na SPORT_VIEW

	if (checkSportView.status !== GenEnum.SUCCESS && checkSportEdit.status !== GenEnum.SUCCESS) {
		res.status(checkSportView.status).json({ message: checkSportView.message });
		return;
	}

	let userId = -1;

	if (checkSportView.status === GenEnum.SUCCESS) {
		userId = checkSportView.data?.userId || -1;
	} else {
		userId = checkSportEdit.data?.userId || -1;
	}

	try {
		const resLabs = await getSportDetailLabsMod({ sportId: sportIdNumber });

		if (resLabs.status === GenEnum.FAILURE || !resLabs.data) {
			res.status(resLabs.status).json({ message: resLabs.message, data: [] });
			return;
		}

		let resVals = await getSportDetailValsMod({ sportId: sportIdNumber, userId });

		if (resVals.status === GenEnum.FAILURE) {
			res.status(resVals.status).json({ message: resVals.message, data: [] });
			return;
		}

		let missingLabels;

		if (!resVals.data || resVals.data.length === 0) {
			missingLabels = resLabs.data;
		} else if (resLabs.data.length !== resVals.data.length) {
			const existingLabelIds = new Set(resVals.data.map((val) => val.sport_detail_label_id));
			missingLabels = resLabs.data.filter((lab) => !existingLabelIds.has(lab.sport_detail_label_id));
		}

		if (missingLabels) {
			const missingSportDetailIds = missingLabels.map((lab) => {
				return { sportDetailLabelId: lab.sport_detail_label_id, orderNumber: lab.order_number };
			});

			const resCreateVals = await createMissingSportDetailValsMod({ sportId: sportIdNumber, missingSportDetailIds, userId });

			if (resCreateVals.status === GenEnum.FAILURE) {
				res.status(resCreateVals.status).json({ message: resCreateVals.message, data: [] });
				return;
			}

			resVals = await getSportDetailValsMod({ sportId: sportIdNumber, userId });
		}

		const labsAndVals = resLabs.data
			.map((lab) => {
				const val = resVals.data?.find((val) => val.sport_detail_label_id === lab.sport_detail_label_id);

				return {
					sportDetailLabId: lab.sport_detail_label_id,
					sportDetailValId: val?.sport_detail_value_id ?? -1,
					label: lab.label,
					value: val?.value ?? "",
					orderNumber: lab.order_number,
				};
			})
			.sort((a, b) => a.orderNumber - b.orderNumber);

		res.status(200).json({ message: "Štítky a hodnoty podrobností sportu úspěšně předány", data: labsAndVals });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
