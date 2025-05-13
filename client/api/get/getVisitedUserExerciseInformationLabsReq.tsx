import { ExerciseInformationLabel } from "@/components/large/ExerciseInformations";
import { GenericResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	sportId: number;
	authToken?: string;
	visitedUserId: number;

}

export const getVisitedUserExerciseInformationLabsReq = async (props: Props): Promise<GenericResponse<ExerciseInformationLabel[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-visited-user-exercise-information-labels?sportId=${props.sportId}&visitedUserId=${props.visitedUserId}`, {
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
