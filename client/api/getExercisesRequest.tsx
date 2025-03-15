import { GenericApiResponse } from "./GenericApiResponse";
const cookie = require("cookie");

export interface Exercise {
	exerciseId: number;
	categoryId: number;
	sportDifficultyId: number;

	exerciseName: string;
	orderNumber: number;
	description: string;
	youtubeLink: string;
}

interface GetExercisesRequestProps {
	sportId: number;
}

export const getExercisesRequest = async ({ props }: { props: GetExercisesRequestProps }): Promise<GenericApiResponse<Exercise[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-exercises?sportId=${props.sportId}`, {
			method: "GET",
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
