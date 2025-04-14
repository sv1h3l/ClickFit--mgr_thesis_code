import QRCode from "qrcode";

const url = "http://192.168.0.138:3000/connection?cc=";

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
