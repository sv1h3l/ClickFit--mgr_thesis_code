"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectionCont = void 0;
const createConnectionMod_1 = require("../../models/create/createConnectionMod");
const getConnectedUserMod_1 = require("../../models/get/getConnectedUserMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const checkConnectionCodeMod_1 = require("../../models/residue/checkConnectionCodeMod");
const checkExistingConnectionMod_1 = require("../../models/residue/checkExistingConnectionMod");
const checkOwnCodeMod_1 = require("../../models/residue/checkOwnCodeMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createConnectionCont = async (req, res) => {
    const { connectionCode } = req.body;
    if (!connectionCode || connectionCode === -1 || typeof connectionCode !== "number" || connectionCode.toString().length !== 12) {
        res.status(422).json({ message: "Kód spojení musí být 12ciferné číslo" });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req, authToken: !authToken ? undefined : authToken });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbCheckOwnCode = await (0, checkOwnCodeMod_1.checkOwnCodeMod)({ connectionCode, userId: userAtrs.data.userId });
        if (dbCheckOwnCode.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(dbCheckOwnCode.status).json({ message: dbCheckOwnCode.message });
            return;
        }
        const dbCheckConnectionCode = await (0, checkConnectionCodeMod_1.checkConnectionCodeMod)({ connectionCode });
        if (dbCheckConnectionCode.status !== GenResEnum_1.GenEnum.SUCCESS || !dbCheckConnectionCode.data) {
            res.status(dbCheckConnectionCode.status).json({ message: dbCheckConnectionCode.message });
            return;
        }
        const dbCheckExistingConnection = await (0, checkExistingConnectionMod_1.checkExistingConnectionMod)({ firstUserId: userAtrs.data.userId, secondUserId: dbCheckConnectionCode.data.user_id });
        if (dbCheckExistingConnection.status !== GenResEnum_1.GenEnum.SUCCESS) {
            const resUser = await (0, getConnectedUserMod_1.getConnectedUserMod)({
                userId: userAtrs?.data.userId,
                connectionId: dbCheckExistingConnection.data?.connectionId,
            });
            res.status(dbCheckExistingConnection.status).json({ message: dbCheckExistingConnection.message, data: { ...resUser.data, unreadMessages: 0 } });
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