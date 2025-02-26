import GenericApiResponse from "./GenericApiResponse";

const cookie = require("cookie");

interface CategoryCreationRequestProps {
	sportId: number;
	categoryName: string;
	orderNumber: number;
}

export interface CategoryCreationResponse {
	categoryId: number;
}

export const categoryCreationRequest = async ({ props }: { props: CategoryCreationRequestProps }): Promise<GenericApiResponse<CategoryCreationResponse>> => {
	try {
		const cookies = cookie.parse(document.cookie || "");
		const userEmail = cookies.userEmail || null; // TODO autentizace emailu

		// TODO přžedávat i order number
		const response = await fetch("http://localhost:5000/api/create-category", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(props),
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		// Zajištění návratu správné odpovědi z backendu
		return { status: response.status, message: responseData.message, data: responseData.data };
	} catch {
		return { status: 500, message: "Network error or server unreachable" };
	}
};
