"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = __importDefault(require("fs/promises"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const nodemailerUser = process.env.NM_USER;
const nodemailerPass = process.env.NM_PASS;
const clientHost = process.env.CLIENT_HOST || "10.0.0.99";
const clientPort = process.env.CLIENT_PORT || 3000;
const sendVerificationEmail = async (email, token) => {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: nodemailerUser,
            pass: nodemailerPass,
        },
    });
    const verificationUrl = `http://${clientHost}:${clientPort}/verification?token=${token}`;
    try {
        let htmlContent = await promises_1.default.readFile("../server/services/verification.html", "utf-8");
        htmlContent = htmlContent.replace("{VERIFICATION_URL}", verificationUrl);
        let info = await transporter.sendMail({
            from: `"KlikFit" <${nodemailerUser}>`,
            to: email,
            subject: "Potvrzení registrace",
            html: htmlContent, // Načtený HTML obsah
        });
        console.log("Verification email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending Verification email:", error);
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=verificationService.js.map