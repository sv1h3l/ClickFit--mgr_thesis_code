"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserSettingsCont = void 0;
const changeUserSettingsMod_1 = require("../../models/change/changeUserSettingsMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserSettingsCont = async (req, res) => {
    const { code, isTextSize } = req.body;
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbRes = await (0, changeUserSettingsMod_1.changeUserSettingsMod)({ userId: userAtrs.data.userId, code, isTextSize });
        res.status(dbRes.status).json({ message: dbRes.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeUserSettingsCont = changeUserSettingsCont;
//# sourceMappingURL=changeUserSettingsCont.js.map