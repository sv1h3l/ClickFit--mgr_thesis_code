import nodemailer from "nodemailer";

export const sendForgottenPasswordEmail = async (email: string, token: string) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "sv1h3l.it@gmail.com",
			pass: "ndgc dppv sijm ajzg",
		},
	});

	const forgottenPasswordUrl = `http://localhost:3000/new-password?token=${token}`;

	try {
		let info = await transporter.sendMail({
			from: '"KlikFit" <sv1h3l.it@gmail.com>',
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
