import GenericApiResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;
	categoryId: number;

	exercisesOfCategory: { exerciseId: number }[];
	reorderCategories: { categoryId: number; orderNumber: number }[];
}
export const deleteCategoryReq = async ({ props }: { props: Props }): Promise<GenericApiResponse<null>> => {
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null; // TODO autentizace emailu

		const response = await fetch("http://localhost:5000/api/delete-category", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(props),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return { status: response.status, message: responseData.message, data: responseData.data || -1 };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
