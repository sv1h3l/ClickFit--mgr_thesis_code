import { ExerciseInformationLabel } from "@/components/ExerciseInformations";
import { GenericApiResponse } from "./GenericApiResponse";
const cookie = require("cookie");

export const getExerciseInformationLabelsRequest = async (sportId: number): Promise<GenericApiResponse<ExerciseInformationLabel[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-exercise-information-labels?sportId=${sportId}`, {
			method: "GET",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return {
			status: response.status,
			message: responseData.message,
			data: responseData.data || [],
		};
	} catch {
		return {
			status: 500,
			message: "Network error or server unreachable",
			data: [],
		};
	}
};
