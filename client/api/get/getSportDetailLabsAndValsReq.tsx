import { SportDetailLabAndVal } from "@/components/large/SportDetails";
import { GenericApiResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	sportId: number;

	authToken?: string;
}

export const getSportDetailLabsAndValsReq = async (props: Props): Promise<GenericApiResponse<SportDetailLabAndVal[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-sport-detail-labels-and-values?sportId=${props.sportId}`, {
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
