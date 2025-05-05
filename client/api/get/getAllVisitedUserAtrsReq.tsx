import { GenericResponse } from "../GenericApiResponse";
import { User } from "./getAllUserAtrsReq";



interface Props {
	authToken: string;

	visitedUserId: number;
}

export const getAllVisitedUserAtrsReq = async (props: Props): Promise<GenericResponse<User>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-all-visited-user-atrs?visitedUserId=${props.visitedUserId}`, {
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
		};
	}
};
