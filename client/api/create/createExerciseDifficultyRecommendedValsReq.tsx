import GenericApiResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;
	sportDifficultyId: number;
	exerciseId: number;

	series: number;
	repetitions: number;
	burden: number;
}

export const createExerciseDifficultyRecommendedValsReq = async (props: Props): Promise<GenericApiResponse<number>> => {
	try {
		const response = await fetch("http://localhost:5000/api/create-exercise-difficulty-recommended-values", {
			method: "POST",
			credentials: "include",
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
