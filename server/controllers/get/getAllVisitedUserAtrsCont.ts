import { Request, Response } from "express";
import { getAllUserAtrsMod } from "../../models/get/getAllUserAtrsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const getAllVisitedUserAtrsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	const visitedUserId = Number(req.query.visitedUserId);

	if (!visitedUserId || visitedUserId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, authToken, id: visitedUserId, checkAuthorizationCode: CheckAuthorizationCodeEnum.USER_VISIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const allUserAtrs = await getAllUserAtrsMod({ userId: visitedUserId });

		let formattedUser;
		if (allUserAtrs.status === GenEnum.SUCCESS || allUserAtrs.data) {
			formattedUser = {
				userId: allUserAtrs.data!.user_id,
				subscriptionId: allUserAtrs.data!.subscription_id,

				email: "",

				firstName: allUserAtrs.data!.first_name,
				lastName: allUserAtrs.data!.last_name,

				height: allUserAtrs.data!.height,
				weight: allUserAtrs.data!.weight,
				age: allUserAtrs.data!.age,
				sex: allUserAtrs.data!.sex,

				health: allUserAtrs.data!.health,
			};
		}

		res.status(allUserAtrs.status).json({ message: allUserAtrs.message, data: formattedUser });
	} catch (error) {
		console.error("Nastala serverová chyba: " + error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
