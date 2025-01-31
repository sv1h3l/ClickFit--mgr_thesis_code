import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();
const nodemailerUser = process.env.NM_USER;
const nodemailerPass = process.env.NM_PASS;

export const sendVerificationEmail = async (email: string, token: string) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: nodemailerUser,
            pass: nodemailerPass,
        },
    });

    const verificationUrl = `http://localhost:3000/verification?token=${token}`;

    try {
        let htmlContent = await fs.readFile("../services/verification.html", "utf-8");

        htmlContent = htmlContent.replace("{VERIFICATION_URL}", verificationUrl);

        let info = await transporter.sendMail({
            from: `"KlikFit" <${nodemailerUser}>`,
            to: email,
            subject: "Potvrzení registrace",
            html: htmlContent, // Načtený HTML obsah
        });

        console.log("Verification email sent: " + info.response);
    } catch (error) {
        console.error("Error sending Verification email:", error);
    }
};
