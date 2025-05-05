"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedUserAndMessagesCont = void 0;
const getConnectedUserMod_1 = require("../../models/get/getConnectedUserMod");
const getMessagesMod_1 = require("../../models/get/getMessagesMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUnreadMessagesMod_1 = require("../../models/change/changeUnreadMessagesMod");
const getConnectedUserAndMessagesCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token" });
        return;
    }
    const connectionId = Number(req.query.connectionId);
    if (isNaN(connectionId)) {
        res.status(400).json({ message: "Neplatné ID spojení" });
        return;
    }
    try {
        const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req, authToken });
        if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
            res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
            return;
        }
        const resUser = await (0, getConnectedUserMod_1.getConnectedUserMod)({
            userId: dbUserAtr.data.userId,
            connectionId,
        });
        const resMessages = await (0, getMessagesMod_1.getMessagesMod)({
            connectionId,
        });
        (0, changeUnreadMessagesMod_1.changeUnreadMessagesMod)({
            userId: dbUserAtr.data.userId,
            connectionId,
        });
        res.status(resMessages.status).json({
            message: resMessages.message,
            data: { userId: dbUserAtr.data.userId, connectedUser: resUser.data, messages: resMessages.data },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Nastala serverová chyba, zkuste to znovu",
        });
    }
};
exports.getConnectedUserAndMessagesCont = getConnectedUserAndMessagesCont;
//# sourceMappingURL=getConnectedUserAndMessagesCont.js.map