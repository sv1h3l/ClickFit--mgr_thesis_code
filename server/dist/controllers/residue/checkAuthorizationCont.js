"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorizationCont = exports.CheckAuthorizationCodeEnum = void 0;
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const checkDiaryAuthorMod_1 = require("../../models/residue/checkDiaryAuthorMod");
const checkExercisesInformationAuthorMod_1 = require("../../models/residue/checkExercisesInformationAuthorMod");
const checkSharedSportMod_1 = require("../../models/residue/checkSharedSportMod");
const checkGraphOwnerMod_1 = require("../../models/residue/checkGraphOwnerMod");
const checkSportValOwnerMod_1 = require("../../models/residue/checkSportValOwnerMod");
const checkSportAuthorMod_1 = require("../../models/residue/checkSportAuthorMod");
const checkTrainingPlanViewMod_1 = require("../../models/residue/checkTrainingPlanViewMod");
const checkUserVisitMod_1 = require("../../models/residue/checkUserVisitMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const cookie = require("cookie");
var CheckAuthorizationCodeEnum;
(function (CheckAuthorizationCodeEnum) {
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["SPORT_EDIT"] = 1] = "SPORT_EDIT";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["SPORT_VIEW"] = 2] = "SPORT_VIEW";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["EXERCISE_INFORMATION_EDIT"] = 3] = "EXERCISE_INFORMATION_EDIT";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["DIARY_EDIT"] = 4] = "DIARY_EDIT";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["USER_VISIT"] = 5] = "USER_VISIT";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["VISIT_DIARY"] = 6] = "VISIT_DIARY";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["TRAINING_PLAN_VIEW"] = 7] = "TRAINING_PLAN_VIEW";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["GRAPH_EDIT"] = 8] = "GRAPH_EDIT";
    CheckAuthorizationCodeEnum[CheckAuthorizationCodeEnum["SPORT_VAL_EDIT"] = 9] = "SPORT_VAL_EDIT";
})(CheckAuthorizationCodeEnum || (exports.CheckAuthorizationCodeEnum = CheckAuthorizationCodeEnum = {}));
const checkAuthorizationCont = async (props) => {
    let concreteAuthToken;
    if (props.authToken && props.authToken !== "undefined") {
        concreteAuthToken = props.authToken;
    }
    else {
        const cookies = cookie.parse(props.req.headers.cookie || "");
        concreteAuthToken = cookies.authToken || null;
    }
    if (!concreteAuthToken) {
        return { status: GenResEnum_1.GenEnum.UNAUTHORIZED, message: "Nebyl předán autorizační token" };
    }
    try {
        const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req: props.req, authToken: concreteAuthToken });
        if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
            return { status: GenResEnum_1.GenEnum.UNAUTHORIZED, message: "Nastala chyba během získávání atributů uživatele" };
        }
        const userId = dbUserAtr.data.userId;
        let dbRes;
        switch (props.checkAuthorizationCode) {
            case CheckAuthorizationCodeEnum.SPORT_EDIT:
                dbRes = await (0, checkSportAuthorMod_1.checkSportAuthorMod)(userId, props.id);
                break;
            case CheckAuthorizationCodeEnum.EXERCISE_INFORMATION_EDIT:
                dbRes = await (0, checkExercisesInformationAuthorMod_1.checkExercisesInformationAuthorMod)(userId, props.id);
                break;
            case CheckAuthorizationCodeEnum.DIARY_EDIT:
                dbRes = await (0, checkDiaryAuthorMod_1.checkDiaryAuthorMod)({ userId, diaryId: props.id });
                break;
            case CheckAuthorizationCodeEnum.USER_VISIT:
                dbRes = await (0, checkUserVisitMod_1.checkUserVisitMod)({ userId, visitedUserId: props.id });
                break;
            case CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW:
                dbRes = await (0, checkTrainingPlanViewMod_1.checkTrainingPlanViewMod)({ userId, trainingPlanId: props.id });
                break;
            case CheckAuthorizationCodeEnum.SPORT_VIEW:
                dbRes = await (0, checkSharedSportMod_1.checkSharedSportMod)({ userId, sharedSportId: props.id });
                break;
            case CheckAuthorizationCodeEnum.GRAPH_EDIT:
                dbRes = await (0, checkGraphOwnerMod_1.checkGraphOwnerMod)({ userId, graphId: props.id });
                break;
            case CheckAuthorizationCodeEnum.SPORT_VAL_EDIT:
                dbRes = await (0, checkSportValOwnerMod_1.checkSportValOwnerMod)({ userId, valId: props.id });
                break;
            /* TODO
            case CheckAuthorizationCodeEnum.EXERCISE_INFORMATION_EDIT:
                
                break;*/
            default:
                return { status: GenResEnum_1.GenEnum.UNAUTHORIZED, message: "Zadán neexistující autorizační kód" };
        }
        if (dbRes.status === GenResEnum_1.GenEnum.SUCCESS) {
            return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Přístup povolen", data: { userId, userEmail: dbUserAtr.data.userEmail } };
        }
        else {
            return { status: GenResEnum_1.GenEnum.UNAUTHORIZED, message: "Přístup zamítnut" };
        }
    }
    catch (error) {
        console.error("Nastala chyba během autorizace: ", error);
        return { status: GenResEnum_1.GenEnum.UNAUTHORIZED, message: "Nastala chyba během autorizace" };
    }
};
exports.checkAuthorizationCont = checkAuthorizationCont;
//# sourceMappingURL=checkAuthorizationCont.js.map