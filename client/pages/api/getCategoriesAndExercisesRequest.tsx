import { GenericApiResponse } from "./GenericApiResponse";
import { Exercise } from "./getExercisesRequest";
const cookie = require("cookie");

export interface Category {
	categoryId: number;
	categoryName: string;
	orderNumber: number;

	exercises: Exercise[];
}

interface getCategoriesAndExercisesRequestProps {
	sportId: number;
}

export const getCategoriesAndExercisesRequest = async ({ props }: { props: getCategoriesAndExercisesRequestProps }): Promise<GenericApiResponse<Category[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-categories-and-exercises?sportId=${props.sportId}`, {
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
