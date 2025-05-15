"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSettingsCont = void 0;
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getUserSettingsMod_1 = require("../../models/get/getUserSettingsMod");
const getUserSettingsCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token", data: [] });
        return;
    }
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req, authToken });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const userSettings = await (0, getUserSettingsMod_1.getUserSettingsMod)({ userId: userAtrs.data.userId });
        res.status(userSettings.status).json({ message: userSettings.message, data: userSettings.data });
    }
    catch (error) {
        console.error("Nastala serverová chyba: " + error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getUserSettingsCont = getUserSettingsCont;
//# sourceMappingURL=getUserSettingsCont.js.map