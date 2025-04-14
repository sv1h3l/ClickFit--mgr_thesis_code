import { Diary, Graph, GraphValue } from "@/components/large/DiaryAndGraphs";
import { GenericApiResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	graphId: number;
	defaultGraph: boolean
}

export const getGraphValuesReq = async (props: Props): Promise<GenericApiResponse<GraphValue[]>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-graph-values?graphId=${props.graphId}&defaultGraph=${props.defaultGraph}`, {
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
			data: responseData.data,
		};
	} catch {
		return {
			status: 500,
			message: "Network error or server unreachable",
		};
	}
};
