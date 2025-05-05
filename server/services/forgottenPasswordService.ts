import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs/promises";


dotenv.config();
const nodemailerUser = process.env.NM_USER;
const nodemailerPass = process.env.NM_PASS;

const clientHost = process.env.CLIENT_HOST || "10.0.0.99";
const clientPort = process.env.CLIENT_PORT || 3000;

export const sendForgottenPasswordEmail = async (email: string, token: string) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: nodemailerUser,
			pass: nodemailerPass,
		},
	});

	const forgottenPasswordUrl = `http://${clientHost}:${clientPort}/new-password?token=${token}`;

	try {
		let htmlContent = await fs.readFile("../server/services/forgottenPassword.html", "utf-8");

		htmlContent = htmlContent.replace("{FORGOTTEN_PASSWORD_URL}", forgottenPasswordUrl);

		let info = await transporter.sendMail({
			from: `"KlikFit" <${nodemailerUser}>`,
			to: email,
			subject: "Zapomenuté heslo",
			html: htmlContent,
		});

		console.log("Forgotten password email sent: " + info.response);
	} catch (error) {
		console.error("Error sending forgotten password email:", error);
	}
};
