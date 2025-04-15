import { ConnectedUser } from "@/pages/connection";
import { GenericApiResponse } from "../GenericApiResponse";

interface Props {
	authToken: string;

	connectionId: number;
}

interface Res {
	userId: number;

	connectedUser: ConnectedUser;
}

export const getConnectedUserReq = async (props: Props): Promise<GenericApiResponse<Res>> => {
	try {
		const response = await fetch(`http://localhost:5000/api/get-connected-user?connectionId=${props.connectionId}`, {
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
