import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

interface CreateExerciseInformatinLabelRequestProps {
	sportId: number;

	exerciseInformationLabel: string;
	orderNumber: number;
}
export const createExerciseInformationLabelRequest = async ({ sportId, exerciseInformationLabel, orderNumber }: CreateExerciseInformatinLabelRequestProps): Promise<GenericApiResponse<null>> => {
	try {
		const response = await fetch("http://localhost:5000/api/create-exercise-information-label", {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sportId, exerciseInformationLabel, orderNumber }),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return { status: response.status, message: responseData.message, data: responseData.data };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
