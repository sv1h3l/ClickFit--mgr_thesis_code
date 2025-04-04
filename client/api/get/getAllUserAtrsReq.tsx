import { GenericApiResponse } from "../GenericApiResponse";

export interface User {
	userId: number;
	subscription_id: number;

	userEmail: string;

	email: string;
	firstName: string;
	lastName: string;

	age: number;
	sex: "muž" | "žena" | "neuvedeno";
	height: number;
	weight: number;
	health: string;
}

interface Props {
	authToken: string;
}

export const getAllUserAtrsReq = async (props: Props): Promise<GenericApiResponse<User>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-all-user-atrs`, {
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
