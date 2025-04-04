import { Request, Response } from "express";
import { changeUserAtrMod } from "../../models/change/changeUserAtrMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export enum ChangeUserAtrCodeEnum {
	FIRST_NAME = 1,
	LAST_NAME = 2,
	HEIGHT = 3,
	WEIGHT = 4,
	AGE = 5,
}

export const changeUserAtrCont = async (req: Request, res: Response): Promise<void> => {
	const { userAtrCode, value } = req.body;
	const valueAsString = value as string;

	let column = "";

	switch (userAtrCode) {
		case ChangeUserAtrCodeEnum.FIRST_NAME:
		case ChangeUserAtrCodeEnum.LAST_NAME: {
			if (!valueAsString) {
				res.status(400).json({ message: "Nesmí být prázdné" });
				return;
			} else if (valueAsString.length > 20) {
				res.status(400).json({ message: "Nesmí obsahovat více než 20 znaků" });
				return;
			}
			column = userAtrCode === ChangeUserAtrCodeEnum.FIRST_NAME ? "first_name" : "last_name";
			break;
		}
		case ChangeUserAtrCodeEnum.HEIGHT: {
			if (valueAsString.length > 3) {
				res.status(400).json({ message: "Nesmí obsahovat více než 3 znaky" });
				return;
			} else if (value > 300) {
				res.status(400).json({ message: "Nesmí být větší než 300" });
				return;
			} else if (value < 0) {
				res.status(400).json({ message: "Nesmí být záporná" });
				return;
			}
			column = "height";
			break;
		}
		case ChangeUserAtrCodeEnum.WEIGHT: {
			if (valueAsString.length > 3) {
				res.status(400).json({ message: "Nesmí obsahovat více než 3 znaky" });
				return;
			} else if (value > 600) {
				res.status(400).json({ message: "Nesmí být větší než 600" });
				return;
			} else if (value < 0) {
				res.status(400).json({ message: "Nesmí být záporná" });
				return;
			}
			column = "weight";
			break;
		}
		case ChangeUserAtrCodeEnum.AGE: {
			if (valueAsString.length > 3) {
				res.status(400).json({ message: "Nesmí obsahovat více než 3 znaky" });
				return;
			} else if (value > 120) {
				res.status(400).json({ message: "Nesmí být větší než 120" });
				return;
			} else if (value < 0) {
				res.status(400).json({ message: "Nesmí být záporný" });
				return;
			}
			column = "age";
			break;
		}
		default: {
			res.status(422).json({ message: "Neplatný atribut" });
			return;
		}
	}

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbRes = await changeUserAtrMod({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, value, column });

		res.status(dbRes.status).json({ message: dbRes.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
