import GenericApiResponse from "../GenericApiResponse";

const cookie = require("cookie");

interface Props {
	sportId: number;
	categoryName: string;
}

export interface Response {
	categoryId: number;
}

export const createCategoryReq = async ({ props }: { props: Props }): Promise<GenericApiResponse<Response>> => {
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
