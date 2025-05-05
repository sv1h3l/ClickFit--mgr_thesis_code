"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgottenPasswordCont = void 0;
const createTokenMod_1 = require("../../models/create/createTokenMod");
const getTokenMod_1 = require("../../models/get/getTokenMod");
const forgottenPasswordMod_1 = require("../../models/residue/forgottenPasswordMod");
const modifyTokenExpirationMod_1 = require("../../models/residue/modifyTokenExpirationMod");
const forgottenPasswordService_1 = require("../../services/forgottenPasswordService");
const statusOk = async (res, email) => {
    res.status(200).json({ message: "OK" });
    const token = await (0, getTokenMod_1.getTokenMod)(email);
    if (token) {
        (0, forgottenPasswordService_1.sendForgottenPasswordEmail)(email, token);
    }
};
const forgottenPasswordCont = async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(401).json({ message: "Neplatná emailová adresa" });
        return;
    }
    try {
        const status = await (0, forgottenPasswordMod_1.forgottenPassword)(email);
        switch (status) {
            case forgottenPasswordMod_1.ForgottenPasswordStatus.ADD_TOKEN:
                await (0, createTokenMod_1.createTokenMod)(email);
                statusOk(res, email);
                break;
            case forgottenPasswordMod_1.ForgottenPasswordStatus.MODIFY_EXPIRATION:
                await (0, modifyTokenExpirationMod_1.modifyTokenExpirationMod)(email);
                statusOk(res, email);
                break;
            case forgottenPasswordMod_1.ForgottenPasswordStatus.FAILURE:
                res.status(500).json({ message: "Neznámá chyba" });
                break;
            case forgottenPasswordMod_1.ForgottenPasswordStatus.NO_USER_FOUND:
                statusOk(res, email);
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
    }
};
exports.forgottenPasswordCont = forgottenPasswordCont;
//# sourceMappingURL=forgottenPasswordCont.js.map