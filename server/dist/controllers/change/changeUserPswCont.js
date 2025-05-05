"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPswCont = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const changeUserPswMod_1 = require("../../models/change/changeUserPswMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserPswCont = async (req, res) => {
    const { password, confirmPassword } = req.body;
    let error = false;
    let data = { passwordHelperText: "", confirmPasswordHelperText: "" };
    if (password.length < 8) {
        data = { ...data, passwordHelperText: "Heslo musí obsahovat alespoň 8 znaků" };
        error = true;
    }
    if ((confirmPassword === "" && password !== confirmPassword) || password !== confirmPassword) {
        data = { ...data, confirmPasswordHelperText: "Hesla se neshodují" };
        error = true;
    }
    if (error) {
        res.status(400).json({ message: "Heslo nesplňuje požadavky", data });
        return;
    }
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const dbRes = await (0, changeUserPswMod_1.changeUserPswMod)({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, hashedPassword });
        res.status(dbRes.status).json({ message: dbRes.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeUserPswCont = changeUserPswCont;
//# sourceMappingURL=changeUserPswCont.js.map