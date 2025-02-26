import { GenericApiResponse } from "./GenericApiResponse";

export interface Sport {
	userId: number;
	userEmail: string;
	userName: string;

	sportId: number;
	sportName: string;

	hasCategories: boolean;
	hasDifficulties: boolean;

	description: string;
}

export const getSportsRequest = async (userEmail: string): Promise<GenericApiResponse<Sport[]>> => {
	try {
		// Odesíláme email jako query parametr v GET požadavku
		const response = await fetch(`http://localhost:5000/api/get-sports?email=${userEmail}`, {
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
