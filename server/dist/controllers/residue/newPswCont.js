"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPswCont = void 0;
const deleteTokenMod_1 = require("../../models/delete/deleteTokenMod");
const activateUserMod_1 = require("../../models/residue/activateUserMod");
const newPswMod_1 = require("../../models/residue/newPswMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const newPswCont = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    const errors = {};
    let error = false;
    let data = { tokenHelperText: "", passwordHelperText: "", confirmPasswordHelperText: "" };
    if (!token) {
        data = { ...data, tokenHelperText: "Chybějící token" };
        error = true;
    }
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
        const newPswRes = await (0, newPswMod_1.newPswMod)({ token, password });
        if (newPswRes.status === GenResEnum_1.GenEnum.SUCCESS) {
            (0, activateUserMod_1.activateUserMod)(token);
            (0, deleteTokenMod_1.deleteTokenMod)(token);
        }
        res.status(newPswRes.status).json({ message: newPswRes.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.newPswCont = newPswCont;
//# sourceMappingURL=newPswCont.js.map