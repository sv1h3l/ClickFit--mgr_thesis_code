import { Request } from "express";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { checkDiaryAuthorMod } from "../../models/residue/checkDiaryAuthorMod";
import { checkExercisesInformationAuthorMod } from "../../models/residue/checkExercisesInformationAuthorMod";
import { checkSportAuthorMod } from "../../models/residue/checkSportAuthorMod";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

const cookie = require("cookie");

export enum CheckAuthorizationCodeEnum {
	SPORT_EDIT = 1,
	SPORT_VIEW = 2,
	EXERCISE_INFORMATION_EDIT = 3,
	DIARY_EDIT = 4,
}

interface Props {
	req: Request;
	id: number;
	authToken?: string;
	checkAuthorizationCode: CheckAuthorizationCodeEnum;
}

export const checkAuthorizationCont = async (props: Props): Promise<GenRes<{ userId?: number; userEmail?: string }>> => {
	let concreteAuthToken;

	if (props.authToken) {
		concreteAuthToken = props.authToken;
	} else {
		const cookies = cookie.parse(props.req.headers.cookie || "");
		concreteAuthToken = cookies.authToken || null;
	}

	if (!concreteAuthToken) {
		return { status: GenEnum.UNAUTHORIZED, message: "Nebyl předán autorizační token" };
	}

	try {
		const dbUserAtr = await getUserAtrFromAuthTokenMod({ req: props.req, authToken: concreteAuthToken });

		if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
			return { status: GenEnum.UNAUTHORIZED, message: "Nastala chyba během získávání atributů uživatele" };
		}

		let dbRes;
		switch (props.checkAuthorizationCode) {
			case CheckAuthorizationCodeEnum.SPORT_EDIT:
				dbRes = await checkSportAuthorMod(dbUserAtr.data.userId, props.id);
				break;
			case CheckAuthorizationCodeEnum.EXERCISE_INFORMATION_EDIT:
				dbRes = await checkExercisesInformationAuthorMod(dbUserAtr.data.userId, props.id);
				break;
			case CheckAuthorizationCodeEnum.DIARY_EDIT:
				dbRes = await checkDiaryAuthorMod({ userId: dbUserAtr.data.userId, diaryId: props.id });
				break;
			/* TODO
			case CheckAuthorizationCodeEnum.EXERCISE_INFORMATION_EDIT:
				
				break;*/
			default:
				return { status: GenEnum.UNAUTHORIZED, message: "Zadán neexistující autorizační kód" };
		}

		if (dbRes.status === GenEnum.SUCCESS) {
			return { status: GenEnum.SUCCESS, message: "Přístup povolen", data: { userId: dbUserAtr.data.userId, userEmail: dbUserAtr.data.userEmail } };
		} else {
			return { status: GenEnum.UNAUTHORIZED, message: "Přístup zamítnut" };
		}
	} catch (error) {
		console.error("Nastala chyba během autorizace: ", error);
		return { status: GenEnum.UNAUTHORIZED, message: "Nastala chyba během autorizace" };
	}
};
