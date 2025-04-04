import { ExerciseInformationLabel, ExerciseInformationValue } from "@/components/large/ExerciseInformations";
import { GenericApiResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	sportId: number;
	exerciseId: number;
}

export const getExerciseInformationValsReq = async (props : Props): Promise<GenericApiResponse<ExerciseInformationValue[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-exercise-information-values?sportId=${props.sportId}&exerciseId=${props.exerciseId}`, {
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
