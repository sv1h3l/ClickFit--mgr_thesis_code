"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCont = void 0;
const cookie = require("cookie");
const loginUserMod_1 = require("../../models/residue/loginUserMod");
const loginCont = async (req, res) => {
    const { email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || password.length < 8) {
        res.status(401).json({ message: "Neplatné přihlašovací údaje" });
        return;
    }
    try {
        const dbRes = await (0, loginUserMod_1.loginUserMod)(email, password);
        switch (dbRes.status) {
            case loginUserMod_1.LoginStatus.SUCCESS:
                res.setHeader("Set-Cookie", cookie.serialize("authToken", dbRes.authToken, {
                    maxAge: 60 * 60 * 24 * 14, // Cookie will expire in 14 days
                    path: "/", // The cookie is available for the entire site
                }));
                res.status(200).json({ message: "Přihlášení bylo úspěšné" });
                break;
            case loginUserMod_1.LoginStatus.FAILURE:
                res.status(401).json({ message: "Neplatné přihlašovací údaje" });
                break;
            case loginUserMod_1.LoginStatus.USER_INACTIVE:
                res.status(403).json({ message: "Je nutné potvrdit registraci skrze příchozí email" });
                break;
            default:
                res.status(500).json({ message: "Neznámá chyba" });
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
    }
};
exports.loginCont = loginCont;
//# sourceMappingURL=loginCont.js.map