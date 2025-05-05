"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationCont = void 0;
const getTokenMod_1 = require("../../models/get/getTokenMod");
const verificationService_1 = require("../../services/verificationService");
const emailVerificationCont = async (req, res) => {
    const { email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(401).json({ message: "Neplatná emailová adresa" });
        return;
    }
    try {
        const token = await (0, getTokenMod_1.getTokenMod)(email);
        if (!token) {
            res.status(401).json({ message: "Nebyl nalezen účet s tímto emailem" });
            return;
        }
        (0, verificationService_1.sendVerificationEmail)(email, token);
        res.status(200).json({ message: "Byl zaslán ověřovací email" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
    }
};
exports.emailVerificationCont = emailVerificationCont;
//# sourceMappingURL=emailVerificationCont.js.map