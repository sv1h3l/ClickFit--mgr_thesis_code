import GenericResponse from "../GenericApiResponse";

interface Props {
	sportId: number;
	entityId: number;

	entityIsExercise: boolean;

	priorityPoints: number[] ;
}
export const changePriorityPointsReq = async (props: Props): Promise<GenericResponse<null>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	try {
		const response = await fetch(`http://${serverIp}/api/change-priority-points`, {
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

		return { status: response.status, message: responseData.message };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
