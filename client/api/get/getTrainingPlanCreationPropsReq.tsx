import { ExerciseDifficulty } from "@/components/large/ExerciseInformations";
import { GenericResponse } from "../GenericApiResponse";
import { Exercise } from "./getExercisesReq";
import { Sport } from "./getSportsReq";
import { Category } from "./getCategoriesWithExercisesReq";
const cookie = require("cookie");


interface Props {
	sportId: number;
	authToken: string;
}

interface Res {
	sport: Sport;
	categoriesWithExercises?: Category[];
	exercises?: Exercise[];
	recommendedDifficultyVals?: ExerciseDifficulty[];
}

export const getTrainingPlanCreationPropsReq = async (props: Props): Promise<GenericResponse<Res>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-training-plan-creation-props?sportId=${props.sportId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${props.authToken}`,
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
		};
	}
};
