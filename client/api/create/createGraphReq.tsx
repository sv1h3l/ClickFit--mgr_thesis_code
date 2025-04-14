import GenericApiResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;

	graphLabel: string;

	xAxisLabel: string;
	yAxisLabel: string;

	unit: string;

	hasDate: boolean;
	hasGoals: boolean;
	createDefGraph: boolean;
}

export const createGraphReq = async (props: Props): Promise<GenericApiResponse<{ graphId: number; orderNumber: number; defaultGraphOnId: number; helperTexts: { [key: string]: string } }>> => {
	try {
		const response = await fetch("http://localhost:5000/api/create-graph", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(props),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return { status: response.status, message: responseData.message, data: responseData.data };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
