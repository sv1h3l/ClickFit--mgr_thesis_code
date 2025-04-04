import GenericApiResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;

	reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[];
}
export const moveSportDetailLabelReq = async (props: Props): Promise<GenericApiResponse<null>> => {
	try {
		const response = await fetch("http://localhost:5000/api/move-sport-detail-label", {
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
