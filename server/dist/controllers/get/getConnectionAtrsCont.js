"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionAtrsCont = void 0;
const getConnectedUsersMod_1 = require("../../models/get/getConnectedUsersMod");
const getConnectionCodeMod_1 = require("../../models/get/getConnectionCodeMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getConnectionAtrsCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token", data: [] });
        return;
    }
    try {
        const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req, authToken });
        if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
            res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
            return;
        }
        const resCode = await (0, getConnectionCodeMod_1.getConnectionCodeMod)({ userId: dbUserAtr.data.userId });
        const resUsers = await (0, getConnectedUsersMod_1.getConnectedUsersMod)({ userId: dbUserAtr.data.userId });
        const sortedConnectedUsers = resUsers.data?.sort((a, b) => a.orderNumber - b.orderNumber);
        res.status(resUsers.status).json({ message: resUsers.message, data: { connectionCode: resCode.data?.connectionCode, connectedUsers: sortedConnectedUsers } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getConnectionAtrsCont = getConnectionAtrsCont;
//# sourceMappingURL=getConnectionAtrsCont.js.map