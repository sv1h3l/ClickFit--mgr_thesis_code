import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

interface ExerciseCreationRequestProps {
	sportId: number;
	exerciseName: string;
	categoryId: number;
	orderNumber: number;
}

export interface ExerciseCreationResponse {
	exerciseId: number;
}

export const exerciseCreationRequest = async ({ props }: { props: ExerciseCreationRequestProps }): Promise<GenericApiResponse<ExerciseCreationResponse>> => {
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null; // TODO autentizace emailu

		// TODO přžedávat i order number
		const response = await fetch("http://localhost:5000/api/create-exercise", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(props),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		// Zajištění návratu správné odpovědi z backendu
		return { status: response.status, message: responseData.message, data: responseData.data };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
