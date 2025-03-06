import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

interface DeleteExerciseRequestProps {
	sportId: number;
	exerciseId: number;

	reorderExercises: { exerciseId: number; orderNumber: number }[];
}
export const deleteExerciseRequest = async ({ props }: { props: DeleteExerciseRequestProps }): Promise<GenericApiResponse<null>> => {
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null; // TODO autentizace emailu

		const response = await fetch("http://localhost:5000/api/delete-exercise", {
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
