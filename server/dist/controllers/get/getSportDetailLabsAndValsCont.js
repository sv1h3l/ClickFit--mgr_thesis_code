"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportDetailLabsAndValsCont = void 0;
const getSportDetailLabsMod_1 = require("../../models/get/getSportDetailLabsMod");
const getSportDetailValsMod_1 = require("../../models/get/getSportDetailValsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const createMissingSportDetailValsMod_1 = require("./../../models/create/createMissingSportDetailValsMod");
const getSportDetailLabsAndValsCont = async (req, res) => {
    const { sportId } = req.query;
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    if (!sportId || sportIdNumber === -1) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportIdNumber, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_VIEW, authToken }); // TODO předělat na SPORT_VIEW
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS || !checkRes.data?.userId) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const resLabs = await (0, getSportDetailLabsMod_1.getSportDetailLabsMod)({ sportId: sportIdNumber });
        if (resLabs.status === GenResEnum_1.GenEnum.FAILURE || !resLabs.data) {
            res.status(resLabs.status).json({ message: resLabs.message, data: [] });
            return;
        }
        let resVals = await (0, getSportDetailValsMod_1.getSportDetailValsMod)({ sportId: sportIdNumber, userId: checkRes.data.userId });
        if (resVals.status === GenResEnum_1.GenEnum.FAILURE) {
            res.status(resVals.status).json({ message: resVals.message, data: [] });
            return;
        }
        let missingLabels;
        if (!resVals.data || resVals.data.length === 0) {
            missingLabels = resLabs.data;
        }
        else if (resLabs.data.length !== resVals.data.length) {
            const existingLabelIds = new Set(resVals.data.map((val) => val.sport_detail_label_id));
            missingLabels = resLabs.data.filter((lab) => !existingLabelIds.has(lab.sport_detail_label_id));
        }
        if (missingLabels) {
            const missingSportDetailIds = missingLabels.map((lab) => {
                return { sportDetailLabelId: lab.sport_detail_label_id, orderNumber: lab.order_number };
            });
            const resCreateVals = await (0, createMissingSportDetailValsMod_1.createMissingSportDetailValsMod)({ sportId: sportIdNumber, missingSportDetailIds, userId: checkRes.data.userId });
            if (resCreateVals.status === GenResEnum_1.GenEnum.FAILURE) {
                res.status(resCreateVals.status).json({ message: resCreateVals.message, data: [] });
                return;
            }
            resVals = await (0, getSportDetailValsMod_1.getSportDetailValsMod)({ sportId: sportIdNumber, userId: checkRes.data.userId });
        }
        const labsAndVals = resLabs.data
            .map((lab) => {
            const val = resVals.data?.find((val) => val.sport_detail_label_id === lab.sport_detail_label_id);
            return {
                sportDetailLabId: lab.sport_detail_label_id,
                sportDetailValId: val?.sport_detail_value_id ?? -1,
                label: lab.label,
                value: val?.value ?? "",
                orderNumber: lab.order_number,
            };
        })
            .sort((a, b) => a.orderNumber - b.orderNumber);
        res.status(200).json({ message: "Štítky a hodnoty podrobností sportu úspěšně předány", data: labsAndVals });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getSportDetailLabsAndValsCont = getSportDetailLabsAndValsCont;
//# sourceMappingURL=getSportDetailLabsAndValsCont.js.map