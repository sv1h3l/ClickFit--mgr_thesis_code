import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

// TODO smazat, nejsíš nebude potřeba
export interface Value {
	orderNumber: number;
	name: string;
}

export interface SportCreationResponse {
	userId: number;
	userEmail: string;
	userName: string;

	sportId: number;
}

export const createSportRequest = async (data: { sportName: string }): Promise<GenericApiResponse<SportCreationResponse>> => {
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null;

		const reqData = { ...data, userEmail };

		const response = await fetch("http://localhost:5000/api/create-sport", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqData),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		// Zajištění návratu správné odpovědi z backendu
		return { status: response.status, message: responseData.message, data: { ...responseData.data, userEmail } };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
