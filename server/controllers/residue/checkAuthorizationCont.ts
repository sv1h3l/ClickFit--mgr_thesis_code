import { Request } from "express";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { checkDiaryAuthorMod } from "../../models/residue/checkDiaryAuthorMod";
import { checkExercisesInformationAuthorMod } from "../../models/residue/checkExercisesInformationAuthorMod";
import { checkSharedSportMod } from "../../models/residue/checkSharedSportMod";
import { checkGraphOwnerMod } from "../../models/residue/checkGraphOwnerMod";
import { checkSportValOwnerMod } from "../../models/residue/checkSportValOwnerMod";
import { checkSportAuthorMod } from "../../models/residue/checkSportAuthorMod";
import { checkTrainingPlanViewMod } from "../../models/residue/checkTrainingPlanViewMod";
import { checkUserVisitMod } from "../../models/residue/checkUserVisitMod";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

const cookie = require("cookie");

export enum CheckAuthorizationCodeEnum {
	SPORT_EDIT = 1,
	SPORT_VIEW = 2,
	EXERCISE_INFORMATION_EDIT = 3,
	DIARY_EDIT = 4,
	USER_VISIT = 5,
	VISIT_DIARY = 6,
	TRAINING_PLAN_VIEW = 7,
	GRAPH_EDIT = 8,
	SPORT_VAL_EDIT = 9,
}

interface Props {
	req: Request;
	id: number;
	authToken?: string;
	checkAuthorizationCode: CheckAuthorizationCodeEnum;
}

export const checkAuthorizationCont = async (props: Props): Promise<GenRes<{ userId?: number; userEmail?: string }>> => {
	let concreteAuthToken;

	if (props.authToken && props.authToken !== "undefined") {
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

		const userId = dbUserAtr.data.userId;

		let dbRes;
		switch (props.checkAuthorizationCode) {
			case CheckAuthorizationCodeEnum.SPORT_EDIT:
				dbRes = await checkSportAuthorMod(userId, props.id);
				break;
			case CheckAuthorizationCodeEnum.EXERCISE_INFORMATION_EDIT:
				dbRes = await checkExercisesInformationAuthorMod(userId, props.id);
				break;
			case CheckAuthorizationCodeEnum.DIARY_EDIT:
				dbRes = await checkDiaryAuthorMod({ userId, diaryId: props.id });
				break;
			case CheckAuthorizationCodeEnum.USER_VISIT:
				dbRes = await checkUserVisitMod({ userId, visitedUserId: props.id });
				break;
			case CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW:
				dbRes = await checkTrainingPlanViewMod({ userId, trainingPlanId: props.id });
				break;

			case CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW:
				dbRes = await checkTrainingPlanViewMod({ userId, trainingPlanId: props.id });
				break;
			case CheckAuthorizationCodeEnum.SPORT_VIEW:
				dbRes = await checkSharedSportMod({ userId, sharedSportId: props.id });
				break;
			case CheckAuthorizationCodeEnum.GRAPH_EDIT:
				dbRes = await checkGraphOwnerMod({ userId, graphId: props.id });
				break;
			case CheckAuthorizationCodeEnum.SPORT_VAL_EDIT:
				dbRes = await checkSportValOwnerMod({ userId, valId: props.id });
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
