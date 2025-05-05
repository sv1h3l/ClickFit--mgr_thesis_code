"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserAtrsCont = void 0;
const getAllUserAtrsMod_1 = require("../../models/get/getAllUserAtrsMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getAllUserAtrsCont = async (req, res) => {
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
        const allUserAtrs = await (0, getAllUserAtrsMod_1.getAllUserAtrsMod)({ userId: userAtrs.data.userId });
        let formattedUser;
        if (allUserAtrs.status === GenResEnum_1.GenEnum.SUCCESS || allUserAtrs.data) {
            formattedUser = {
                userId: allUserAtrs.data.user_id,
                subscriptionId: allUserAtrs.data.subscription_id,
                email: allUserAtrs.data.email,
                firstName: allUserAtrs.data.first_name,
                lastName: allUserAtrs.data.last_name,
                height: allUserAtrs.data.height,
                weight: allUserAtrs.data.weight,
                age: allUserAtrs.data.age,
                sex: allUserAtrs.data.sex,
                health: allUserAtrs.data.health,
            };
        }
        res.status(allUserAtrs.status).json({ message: allUserAtrs.message, data: formattedUser });
    }
    catch (error) {
        console.error("Nastala serverová chyba: " + error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getAllUserAtrsCont = getAllUserAtrsCont;
//# sourceMappingURL=getAllUserAtrsCont.js.map