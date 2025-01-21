import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "sv1h3l.it@gmail.com",
			pass: "ndgc dppv sijm ajzg",
		},
	});

	const verificationUrl = `http://localhost:3000/verification?token=${token}`;

	try {
		let info = await transporter.sendMail({
			from: '"KlikFit" <sv1h3l.it@gmail.com>',
			to: email,
			subject: "Potvrzení registrace",
			text: `Děkujeme za registraci! Klikněte na následující odkaz pro potvrzení registrace: ${verificationUrl}`,
			html: ` <div>
                        <h1 style:"color: red;" >Potvrzení registrace</h1>
                        <p>
                        Děkujeme za registraci! Klikněte na následující odkaz pro potvrzení registrace: <a href="${verificationUrl}">${verificationUrl}</a>
                        </p>
                    </div>`,
		});

		console.log("Verification email sent: " + info.response);
	} catch (error) {
		console.error("Error sending Verification email:", error);
	}
};
