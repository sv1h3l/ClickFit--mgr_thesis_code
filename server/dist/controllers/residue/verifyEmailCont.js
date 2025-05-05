"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailCont = void 0;
const activateUserMod_1 = require("../../models/residue/activateUserMod");
const deleteTokenMod_1 = require("../../models/delete/deleteTokenMod");
const verifyEmailCont = async (req, res) => {
    const { token } = req.query;
    if (!token) {
        res.status(400).json({ message: "Chybějící token" });
        return;
    }
    try {
        if (await (0, activateUserMod_1.activateUserMod)(token)) {
            (0, deleteTokenMod_1.deleteTokenMod)(token);
            res.status(200).json({ message: "Účet byl úspěšně aktivován." });
        }
        else {
            res.status(400).json({ message: "Čas pro aktivaci vypršel." });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při aktivaci účtu." });
    }
};
exports.verifyEmailCont = verifyEmailCont;
//# sourceMappingURL=verifyEmailCont.js.map