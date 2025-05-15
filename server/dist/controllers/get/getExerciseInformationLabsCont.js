"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseInformationLabsCont = void 0;
const getExerciseInformationLabsMod_1 = require("../../models/get/getExerciseInformationLabsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getExerciseInformationLabsCont = async (req, res) => {
    const { sportId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        // Kontrola, jestli to je validní číslo
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
    const checkResView = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportIdNumber, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_VIEW, authToken: authToken ? authToken : undefined });
    const checkResEdit = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportIdNumber, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT, authToken: authToken ? authToken : undefined });
    if (checkResView.status !== GenResEnum_1.GenEnum.SUCCESS && checkResEdit.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkResView.status).json({ message: checkResView.message });
        return;
    }
    try {
        const dbRes = await (0, getExerciseInformationLabsMod_1.getExerciseInformationLabsMod)(sportIdNumber);
        if (dbRes.length > 0) {
            const exerciseInformationLabels = dbRes
                .map((exerciseInformationLabel) => {
                return {
                    exerciseInformationLabelId: exerciseInformationLabel.exercise_information_labels_id,
                    label: exerciseInformationLabel.label,
                    orderNumber: exerciseInformationLabel.order_number,
                };
            })
                .sort((a, b) => a.orderNumber - b.orderNumber);
            res.status(200).json({ message: "Informace o cviku úspěšně předány", data: exerciseInformationLabels });
        }
        else {
            res.status(200).json({ message: "Sport nemá žádné informace o cviku", data: {} });
        }
    }
    catch (error) {
        console.error("Chyba při získání informací o cviku: ", error);
        res.status(500).json({ message: "Chyba při získání informací o cviku", data: [] });
    }
};
exports.getExerciseInformationLabsCont = getExerciseInformationLabsCont;
//# sourceMappingURL=getExerciseInformationLabsCont.js.map