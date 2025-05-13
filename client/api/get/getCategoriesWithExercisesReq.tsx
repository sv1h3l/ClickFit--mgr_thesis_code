import { GenericResponse } from "../GenericApiResponse";
import { Exercise } from "./getExercisesReq";
const cookie = require("cookie");

export interface Category {
	categoryId: number;
	categoryName: string;
	orderNumber: number;

	show?: boolean;

	exercises: Exercise[];

	description: string;

	hasRepeatability: boolean;
	repeatabilityQuantity: number;
	looseConnection: number[];
	tightConnection: number | null;
	priorityPoints: number[];
	blacklist: number[];

	shortMinQuantity: number;
	shortMaxQuantity: number;
	mediumMinQuantity: number;
	mediumMaxQuantity: number;
	longMinQuantity: number;
	longMaxQuantity: number;
}

interface Props {
	authToken?: string;
	sportId: number;
}

export const getCategoriesWithExercisesReq = async ({ props }: { props: Props }): Promise<GenericResponse<Category[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-categories-and-exercises?sportId=${props.sportId}`, {
			method: "GET",
			credentials: "include",
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
			data: [],
		};
	}
};
