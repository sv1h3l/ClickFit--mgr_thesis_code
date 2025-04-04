import { GenericApiResponse } from "../GenericApiResponse";

export interface Sport {
	userId: number;
	userEmail: string;
	userName: string;
	canUserEdit: boolean;

	sportId: number;
	sportName: string;

	hasCategories: boolean;
	hasDifficulties: boolean;
	hasRecommendedValues: boolean;
	hasRecommendedDifficultyValues: boolean;

	unitCode: number;

	description: string;
}

interface Props {
	authToken: string;
}

export const getSportsReq = async (props: Props): Promise<GenericApiResponse<Sport[]>> => {
	try {
		// Odesíláme email jako query parametr v GET požadavku
		const response = await fetch(`http://localhost:5000/api/get-sports`, {
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
