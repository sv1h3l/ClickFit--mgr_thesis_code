import { ExerciseDifficulty } from "@/components/large/ExerciseInformations";
import { GenericApiResponse } from "../GenericApiResponse";
import { Exercise } from "./getExercisesReq";
import { Sport } from "./getSportsReq";
const cookie = require("cookie");

export interface Category {
	categoryId: number;
	categoryName: string;
	orderNumber: number;

	show?: boolean;

	exercises: Exercise[];
}

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

export const getTrainingPlanCreationPropsReq = async (props: Props): Promise<GenericApiResponse<Res>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-training-plan-creation-props?sportId=${props.sportId}`, {
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
