"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCont = void 0;
const createSharedSportMod_1 = require("../../models/create/createSharedSportMod");
const checkEmailDuplicityMod_1 = require("../../models/residue/checkEmailDuplicityMod");
const registrateUserMod_1 = require("../../models/residue/registrateUserMod");
const verificationService_1 = require("../../services/verificationService");
const registerCont = async (req, res) => {
    const defFitnessSportId = 156;
    const { name, surname, email, password, confirmPassword } = req.body;
    // Objekt do kterého se shromažďují chyby
    const errors = {};
    // Validace vstupů
    !name && (errors.name = "Jméno nesmí být prázdné");
    !surname && (errors.surname = "Příjmení nesmí být prázdné");
    password !== confirmPassword && (errors.confirmPassword = "Hesla se neshodují");
    password.length < 8 && (errors.password = "Heslo musí obsahovat alespoň 8 znaků");
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        errors.email = "Neplatná emailová adresa";
    }
    else {
        const isDuplicate = await (0, checkEmailDuplicityMod_1.checkEmailDuplicityMod)(email);
        isDuplicate && (errors.email = "Již existuje účet se zadanou emailovou adresou");
    }
    // Pokud existují chyby, vrátí se všechny najednou
    if (Object.keys(errors).length > 0 || name.length > 20 || surname.length > 20 || email.length > 40 || password.length > 40) {
        res.status(400).json({ errors });
        return;
    }
    try {
        // Uložení uživatele do databáze
        const dbRes = await (0, registrateUserMod_1.registrateUserMod)(email, password, name, surname);
        (0, verificationService_1.sendVerificationEmail)(email, dbRes.token); // Odeslání emailu s potvrzovacím tokenem
        const sc = (0, createSharedSportMod_1.createSharedSportMod)({ userId: dbRes.userId, sportId: defFitnessSportId });
        res.status(201).json({ message: "Registrace byla úspěšná." });
    }
    catch (error) {
        console.error(error);
        // Serverová chyba
        res.status(500).json({ message: "Došlo k chybě při registraci." });
    }
};
exports.registerCont = registerCont;
//# sourceMappingURL=registerCont.js.map