import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const nodemailerUser = process.env.NM_USER;
const nodemailerPass = process.env.NM_PASS;

export const sendForgottenPasswordEmail = async (email: string, token: string) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: nodemailerUser,
            pass: nodemailerPass,
        },
    });

	const forgottenPasswordUrl = `http://localhost:3000/new-password?token=${token}`;

	try {
		let info = await transporter.sendMail({
			from: `"KlikFit" <${nodemailerUser}>`,
			to: email,
			subject: "Potvrzení registrace",
			text: `Děkujeme za registraci! Klikněte na následující odkaz pro potvrzení registrace: ${forgottenPasswordUrl}`,
			html: ` <div>
                        <h1 style:"color: red;" >Nové heslo</h1>
                        <p>
                        Klikněte na následující odkaz pro vytvoření nového hesla: <a href="${forgottenPasswordUrl}">${forgottenPasswordUrl}</a>
                        </p>
                    </div>`,
		});

		console.log("Forgotten password email sent: " + info.response);
	} catch (error) {
		console.error("Error sending forgotten password email:", error);
	}
};
