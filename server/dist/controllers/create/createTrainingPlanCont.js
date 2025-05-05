"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingPlanCont = void 0;
const createTrainingPlanMod_1 = require("../../models/create/createTrainingPlanMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createTrainingPlanCont = async (req, res) => {
    const props = req.body;
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const today = new Date();
        const dateOfCreation = `${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}`;
        const dbResult = await (0, createTrainingPlanMod_1.createTrainingPlanMod)({
            authorId: userAtrs.data.userId,
            ownerId: props.ownerId,
            sportId: props.sportId,
            trainingPlanName: props.trainingPlanName,
            canOwnerEdit: props.canOwnerEdit,
            trainingPlanExercises: props.trainingPlanExercises,
            dateOfCreation,
            hasBurdenAndUnit: props.hasBurdenAndUnit,
            unitCode: props.unitCode,
        });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createTrainingPlanCont = createTrainingPlanCont;
//# sourceMappingURL=createTrainingPlanCont.js.map