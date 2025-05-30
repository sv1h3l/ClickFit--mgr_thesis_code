"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseInformationValsCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getExerciseInformationValsMod_1 = require("../../models/get/getExerciseInformationValsMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getExerciseInformationValsCont = async (req, res) => {
    const { sportId, exerciseId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    else if (!exerciseId) {
        res.status(400).json({ message: "Chybějící ID cviku", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId), exerciseIdNumber = Number(exerciseId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    else if (isNaN(exerciseIdNumber)) {
        res.status(400).json({ message: "ID cviku musí být číslo", data: [] });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportIdNumber, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS || !checkRes.data) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbRes = await (0, getExerciseInformationValsMod_1.getExerciseInformationValsMod)(sportIdNumber, exerciseIdNumber, checkRes.data.userId ? checkRes.data.userId : -1);
        if (dbRes.length > 0) {
            const exerciseInformationValues = dbRes.map((exerciseInformationLabel) => {
                return {
                    exerciseInformationLabelId: exerciseInformationLabel.exercise_information_labels_id,
                    exerciseInformationValueId: exerciseInformationLabel.exercise_information_value_id,
                    value: exerciseInformationLabel.value,
                };
            });
            res.status(200).json({ message: "Hodnoty informací o cviku úspěšně předány", data: exerciseInformationValues });
        }
        else {
            res.status(200).json({ message: "Žádné hodnoty informací o cviku nenalezeny", data: [] });
        }
    }
    catch (error) {
        console.error("Chyba při získání informací o cviku: ", error);
        res.status(500).json({ message: "Chyba při získání hodnot informací o cviku", data: [] });
    }
};
exports.getExerciseInformationValsCont = getExerciseInformationValsCont;
//# sourceMappingURL=getExerciseInformationValsCont.js.map