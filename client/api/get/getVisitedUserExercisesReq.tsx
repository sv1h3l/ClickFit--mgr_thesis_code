import { GenericResponse } from "../GenericApiResponse";
const cookie = require("cookie");

export interface Exercise {
	exerciseId: number;
	categoryId: number;
	sportDifficultyId: number;

	exerciseName: string;
	orderNumber: number;
	orderNumberWithoutCategories: number;

	series: number;
	repetitions: number;
	burden: number;
	unitCode: number;

	description: string;
	youtubeLink: string;

	hasRepeatability: boolean;
	repeatabilityQuantity: number;
	looseConnection: number[];
	tightConnection: number | null;
	priorityPoints: number[];
	blacklist: number[];
}

interface Props {
	sportId: number;
	authToken?: string;
	visitedUserId: number;

}

export const getVisitedUserExercisesReq = async ({ props }: { props: Props }): Promise<GenericResponse<Exercise[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-visited-user-exercises?sportId=${props.sportId}&visitedUserId=${props.visitedUserId}`, {
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
