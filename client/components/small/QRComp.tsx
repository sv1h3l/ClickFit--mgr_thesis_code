import QRCode from "qrcode";

const ip = process.env.NEXT_PUBLIC_IP || "10.0.0.99";

const url = `http://${ip}:3000/connection?cc=`;

export const generateQRCode = async (connectionCode: string) => {
	try {
		return await QRCode.toDataURL(url + connectionCode, {
			color: {
				dark: "#EDEDED", // Barva kódu (černá)
				light: "#00000000", // Průhledné pozadí
			},
			width: 300,
			margin: 0,
		});
	} catch (error) {
		console.error("Chyba při generování QR kódu", error);
		return null;
	}
};
