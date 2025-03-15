import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

export interface Value {
	orderNumber: number;
	name: string;
}

export const createSportRequest = async (data: {
	sportName: string;
	sportDetails: Value[];
	sportDescription: string;

	hasASportCategories: boolean;
	sportCategories: Value[];

	hasASportDifficulties: boolean;
	sportDifficulties: Value[];

	exerciseInformations: Value[];
}): Promise<GenericApiResponse<null>> => {
	const cookies = cookie.parse(document.cookie || "");
	const email = cookies.userEmail || null;

	const requestData = { ...data, email };

	try {
		const response = await fetch("http://localhost:5000/api/create-sport", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		// Zajištění návratu správné odpovědi z backendu
		return { status: response.status, message: responseData.message };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
