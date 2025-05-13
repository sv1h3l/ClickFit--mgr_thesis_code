import { GenericResponse } from "../GenericApiResponse";
import { Sport } from "./getSportsReq";

export interface SharedSport
{
	sharedSportId : number; 
	sportId : number; 
	userId : number;  
	authorId : number; 
}

interface Props {
	authToken: string;
	userId: number;
}

export const getSharedSportsReq = async (props: Props): Promise<GenericResponse<SharedSport[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		// Odesíláme email jako query parametr v GET požadavku
		const response = await fetch(`http://${serverIp}/api/get-shared-sports?userId=${props.userId}`, {
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
