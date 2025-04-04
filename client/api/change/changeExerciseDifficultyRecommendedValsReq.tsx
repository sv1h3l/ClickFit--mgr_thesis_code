import GenericApiResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;
	exerciseId: number;
	exerciseDifficultyId: number;

	seriesRepetitonsOrBurden: number;
	series?: number;
	repetitions?: number;
	burden?: number;
}
export const changeExerciseDifficultyRecommendedValsReq = async (props: Props): Promise<GenericApiResponse<null>> => {
	try {
		const response = await fetch("http://localhost:5000/api/change-exercise-with-difficulty-series-repetitions-or-burden", {
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

		return { status: response.status, message: responseData.message };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
