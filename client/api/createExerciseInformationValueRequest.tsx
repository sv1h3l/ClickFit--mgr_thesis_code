import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

interface CreateExerciseInformationValueRequestProps {
	sportId: number;
	exerciseId: number;
	exerciseInformationLabelId: number;

	exerciseInformationValue: string;
}
export const createExerciseInformationValueRequest = async (props: CreateExerciseInformationValueRequestProps): Promise<GenericApiResponse<null>> => {
	try {
		const response = await fetch("http://localhost:5000/api/create-exercise-information-value", {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(props),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return { status: response.status, message: responseData.message, data: responseData.data };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
