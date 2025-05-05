import { Diary, Graph, GraphValue } from "@/components/large/DiaryAndGraphs";
import { GenericResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	graphId: number;
	defaultGraph: boolean
}

export const getGraphValuesReq = async (props: Props): Promise<GenericResponse<GraphValue[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-graph-values?graphId=${props.graphId}&defaultGraph=${props.defaultGraph}`, {
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
