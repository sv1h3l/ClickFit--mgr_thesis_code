import { ExerciseInformationValue } from "@/components/large/ExerciseInformations";
import { GenericApiResponse } from "../GenericApiResponse";
import { SportDifficulty } from "@/components/large/SportDescriptionAndSettings";
const cookie = require("cookie");

interface Props {
	sportId: number;
}

export const getDifficultiesReq = async (props: Props): Promise<GenericApiResponse<SportDifficulty[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-difficulties?sportId=${props.sportId}`, {
			method: "GET",
			credentials: "include",
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
