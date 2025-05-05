import { ConnectedUser } from "@/pages/connection";
import { GenericResponse } from "../GenericApiResponse";
import { Message } from "postcss";

interface Props {
	authToken: string;

	connectionId: number;
}

interface Res {
	userId: number;

	connectedUser: ConnectedUser;

	messages: Message[];
}

export const getConnectedUserAndMessagesReq = async (props: Props): Promise<GenericResponse<Res>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/get-connected-user-and-messages?connectionId=${props.connectionId}`, {
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
