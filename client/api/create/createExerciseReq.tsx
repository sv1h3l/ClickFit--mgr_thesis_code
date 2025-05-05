import GenericResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;
	exerciseName: string;
	categoryId: number;
}

export interface Response {
	exerciseId: number;
	difficultyId: number;
	
	unitCode: number;
	
	orderNumber: number;
	orderNumberWithoutCategories: number;
}

export const createExerciseReq = async ({ props }: { props: Props }): Promise<GenericResponse<Response>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/create-exercise`, {
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
