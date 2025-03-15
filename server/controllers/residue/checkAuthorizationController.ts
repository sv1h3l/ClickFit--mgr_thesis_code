import { Request } from "express";
import { GenericModelReturnEnum } from "../../models/GenericModelReturn";
import { checkExercisesInformationAuthorModel } from "../../models/residue/checkExercisesInformationAuthorModel";
import { checkSportAuthorModel } from "../../models/residue/checkSportAuthorModel";
import { getUserIdFromEmail } from "./../../models/get/getUserIdFromEmail";

const cookie = require("cookie");

export enum CheckAuthorizationCodeEnum {
	SPORT_EDITING = 1,
	EXERCISE_INFORMATION_EDITING = 2,
}

export const checkAuthorizationController = async (req: Request, id: number, checkAuthorizationCode: CheckAuthorizationCodeEnum): Promise<{ authorized: boolean; userId?: number; message: string }> => {
	const cookies = cookie.parse(req.headers.cookie || "");
	const userEmail = cookies.userEmail || null;

	if (!userEmail) {
		return { authorized: false, message: "Přístup zamítnut" };
	}

	try {
		const dbUserId = await getUserIdFromEmail(userEmail);

		if (dbUserId === -1) {
			return { authorized: false, message: "Nastala chyba během získávání ID uživatele" };
		}

		let dbRes;
		switch (checkAuthorizationCode) {
			case CheckAuthorizationCodeEnum.SPORT_EDITING:
				dbRes = await checkSportAuthorModel(dbUserId, id);
				break;
			case CheckAuthorizationCodeEnum.EXERCISE_INFORMATION_EDITING:
				dbRes = await checkExercisesInformationAuthorModel(dbUserId, id);
				break;
			default:
				return { authorized: false, message: "Zadán neexistující autorizační kód" };
		}

		if (dbRes.status === GenericModelReturnEnum.SUCCESS) {
			return { authorized: true, userId: dbUserId, message: "Přístup povolen" };
		} else {
			return { authorized: false, message: "Přístup zamítnut" };
		}
	} catch (error) {
		console.error("Nastala chyba během autorizace: ", error);
		return { authorized: false, message: "Nastala chyba během autorizace" };
	}
};
