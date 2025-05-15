"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserSexCont = void 0;
const changeUserSexMod_1 = require("../../models/change/changeUserSexMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserSexCont = async (req, res) => {
    const { value } = req.body;
    if (value !== "muž" && value !== "žena" && value !== "neuvedeno") {
        res.status(400).json({ message: "Vybráno neexistující pohlaví" });
        return;
    }
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbRes = await (0, changeUserSexMod_1.changeUserSexMod)({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, value });
        res.status(dbRes.status).json({ message: dbRes.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeUserSexCont = changeUserSexCont;
//# sourceMappingURL=changeUserSexCont.js.map