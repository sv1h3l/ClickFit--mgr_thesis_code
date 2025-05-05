"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgottenPasswordEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const promises_1 = __importDefault(require("fs/promises"));
dotenv_1.default.config();
const nodemailerUser = process.env.NM_USER;
const nodemailerPass = process.env.NM_PASS;
const clientHost = process.env.CLIENT_HOST || "10.0.0.99";
const clientPort = process.env.CLIENT_PORT || 3000;
const sendForgottenPasswordEmail = async (email, token) => {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: nodemailerUser,
            pass: nodemailerPass,
        },
    });
    const forgottenPasswordUrl = `http://${clientHost}:${clientPort}/new-password?token=${token}`;
    try {
        let htmlContent = await promises_1.default.readFile("../server/services/forgottenPassword.html", "utf-8");
        htmlContent = htmlContent.replace("{FORGOTTEN_PASSWORD_URL}", forgottenPasswordUrl);
        let info = await transporter.sendMail({
            from: `"KlikFit" <${nodemailerUser}>`,
            to: email,
            subject: "Zapomenuté heslo",
            html: htmlContent,
        });
        console.log("Forgotten password email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending forgotten password email:", error);
    }
};
exports.sendForgottenPasswordEmail = sendForgottenPasswordEmail;
//# sourceMappingURL=forgottenPasswordService.js.map