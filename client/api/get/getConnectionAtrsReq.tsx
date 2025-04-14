import { GenericApiResponse } from "../GenericApiResponse";

interface Props {
	authToken: string;
}

interface Res {
	connectionCode: number;
}

export const getConnectionAtrsReq = async (props: Props): Promise<GenericApiResponse<Res>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-connection-code`, {
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
			data: responseData.data,
		};
	} catch {
		return {
			status: 500,
			message: "Network error or server unreachable",
		};
	}
};
