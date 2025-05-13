import { Diary, Graph } from "@/components/large/DiaryAndGraphs";
import { GenericResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	sportId: number;
}

export const getVisitedUserGraphsReq = async (props: Props): Promise<GenericResponse<Graph[]>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";


	const cookies = cookie.parse(document.cookie);
	const visitedUserId = Number(atob(cookies.view_tmp)) || -1;


	try {
		const response = await fetch(`http://${serverIp}/api/get-visited-user-graphs?sportId=${props.sportId}&visitedUserId=${visitedUserId}`, {
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
