import { Diary } from "@/components/large/DiaryAndGraphs";
import { GenericApiResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	sportId: number;
}

export const getDiaryReq = async (props: Props): Promise<GenericApiResponse<Diary>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-diary?sportId=${props.sportId}`, {
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
