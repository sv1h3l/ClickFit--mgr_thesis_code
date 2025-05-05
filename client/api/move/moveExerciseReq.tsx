import GenericResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;
	hasCategories: boolean;

	reorderExercises: { exerciseId: number; orderNumber: number }[];
}
export const moveExerciseReq = async ({ props }: { props: Props }): Promise<GenericResponse<null>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null; // TODO autentizace emailu

		const response = await fetch(`http://${serverIp}/api/move-exercise`, {
			method: "POST",
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
