import dotenv from "dotenv";
import fs from "fs/promises";
import nodemailer from "nodemailer";

dotenv.config();
const nodemailerUser = process.env.NM_USER;
const nodemailerPass = process.env.NM_PASS;

const clientHost = process.env.CLIENT_HOST || "10.0.0.99";
const clientPort = process.env.CLIENT_PORT || 3000;

export const sendVerificationEmail = async (email: string, token: string) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: nodemailerUser,
			pass: nodemailerPass,
		},
	});

	const verificationUrl = `http://${clientHost}:${clientPort}/verification?token=${token}`;

	try {
		let htmlContent = await fs.readFile("../server/services/verification.html", "utf-8");

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
