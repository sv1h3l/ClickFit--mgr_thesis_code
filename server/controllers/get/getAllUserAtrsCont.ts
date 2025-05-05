import { Request, Response } from "express";
import { getAllUserAtrsMod } from "../../models/get/getAllUserAtrsMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const getAllUserAtrsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req, authToken });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}
		const allUserAtrs = await getAllUserAtrsMod({ userId: userAtrs.data.userId});

		let formattedUser;
		if (allUserAtrs.status === GenEnum.SUCCESS || allUserAtrs.data) {
			formattedUser = {
				userId: allUserAtrs.data!.user_id,
				subscriptionId: allUserAtrs.data!.subscription_id,

				email: allUserAtrs.data!.email,

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
