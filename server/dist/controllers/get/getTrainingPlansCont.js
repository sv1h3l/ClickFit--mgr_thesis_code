"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingPlansCont = void 0;
const getTrainingPlansMod_1 = require("../../models/get/getTrainingPlansMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getTrainingPlansCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token", data: [] });
        return;
    }
    const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req, authToken });
    if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
        res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
        return;
    }
    try {
        const dbResTrainingPlans = await (0, getTrainingPlansMod_1.getTrainingPlansMod)({ userId: dbUserAtr.data.userId });
        res.status(dbResTrainingPlans.status).json({
            message: dbResTrainingPlans.message,
            data: {
                userId: dbUserAtr.data.userId,
                trainingPlans: dbResTrainingPlans.data,
            },
        });
    }
    catch (error) {
        console.error("Chyba při získání tréninkových plánů: ", error);
        res.status(500).json({ message: "Chyba při získání tréninkových plánů" });
    }
};
exports.getTrainingPlansCont = getTrainingPlansCont;
//# sourceMappingURL=getTrainingPlansCont.js.map