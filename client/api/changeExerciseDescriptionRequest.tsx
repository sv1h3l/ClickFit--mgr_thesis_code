import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

interface changeExerciseDescriptionRequestProps {
	sportId: number;
	exerciseId: number

	description: string;
}
export const changeExerciseDescriptionRequest = async ({ sportId,exerciseId, description }: changeExerciseDescriptionRequestProps): Promise<GenericApiResponse<null>> => {
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null; // TODO autentizace emailu

		const response = await fetch("http://localhost:5000/api/change-exercise-description", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sportId, exerciseId, description }),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return { status: response.status, message: responseData.message };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
