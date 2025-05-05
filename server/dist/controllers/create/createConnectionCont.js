"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectionCont = void 0;
const createConnectionMod_1 = require("../../models/create/createConnectionMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const checkConnectionCodeMod_1 = require("../../models/residue/checkConnectionCodeMod");
const checkExistingConnectionMod_1 = require("../../models/residue/checkExistingConnectionMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createConnectionCont = async (req, res) => {
    const { connectionCode } = req.body;
    if (!connectionCode || connectionCode === -1 || typeof connectionCode !== "number" || connectionCode.toString().length !== 12) {
        res.status(400).json({ message: "Kód spojení musí být 12ciferné číslo" });
        return;
    }
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbCheckConnectionCode = await (0, checkConnectionCodeMod_1.checkConnectionCodeMod)({ connectionCode });
        if (dbCheckConnectionCode.status !== GenResEnum_1.GenEnum.SUCCESS || !dbCheckConnectionCode.data) {
            res.status(dbCheckConnectionCode.status).json({ message: dbCheckConnectionCode.message });
            return;
        }
        const dbCheckExistingConnection = await (0, checkExistingConnectionMod_1.checkExistingConnectionMod)({ firstUserId: userAtrs.data.userId, secondUserId: dbCheckConnectionCode.data.user_id });
        if (dbCheckExistingConnection.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(dbCheckExistingConnection.status).json({ message: dbCheckExistingConnection.message });
            return;
        }
        const dbResult = await (0, createConnectionMod_1.createConnectionMod)({ firstUserId: userAtrs.data.userId, secondUserId: dbCheckConnectionCode.data.user_id });
        const connectedUser = {
            connectionId: dbResult.data?.connectionId,
            connectedUserId: dbCheckConnectionCode.data.user_id,
            connectedUserFirstName: dbCheckConnectionCode.data.first_name,
            connectedUserLastName: dbCheckConnectionCode.data.last_name,
            orderNumber: 1,
            unreadMessages: 0,
        };
        res.status(dbResult.status).json({ message: dbResult.message, data: connectedUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createConnectionCont = createConnectionCont;
//# sourceMappingURL=createConnectionCont.js.map