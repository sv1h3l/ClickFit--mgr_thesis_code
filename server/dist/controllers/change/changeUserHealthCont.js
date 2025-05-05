"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserHealthCont = void 0;
const changeUserHealthMod_1 = require("../../models/change/changeUserHealthMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserHealthCont = async (req, res) => {
    const { health } = req.body;
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbRes = await (0, changeUserHealthMod_1.changeUserHealthMod)({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, health });
        res.status(dbRes.status).json({ message: dbRes.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeUserHealthCont = changeUserHealthCont;
//# sourceMappingURL=changeUserHealthCont.js.map