import { ExerciseInformationLabel, ExerciseInformationValue } from "@/components/large/ExerciseInformations";
import { GenericResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	sportId: number;
	exerciseId: number;
}

export const getExerciseInformationValsReq = async (props : Props): Promise<GenericResponse<ExerciseInformationValue[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-exercise-information-values?sportId=${props.sportId}&exerciseId=${props.exerciseId}`, {
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
