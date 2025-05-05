import GenericResponse from "../GenericApiResponse";

interface Props {
	defGraphId: number;
	sportId: number;
	
	orderNumber: number;
}

export const hideDefGraphReq = async (props: Props): Promise<GenericResponse<null>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";
	try {
		const response = await fetch(`http://${serverIp}/api/hide-default-graph`, {
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
