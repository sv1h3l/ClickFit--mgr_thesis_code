import { useAppContext } from "@/utilities/Context";

interface LoginError extends Error {
	status: number;
	message: string;
}

export const loginRequest = async (data: { email: string; password: string }) => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	
	const response = await fetch(`http://${serverIp}/api/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	if (!response.ok) {
		const error: LoginError = new Error() as LoginError;
		error.status = response.status;

		try {
			const errorData = await response.json();
			error.message = errorData.message || "Unknown error";
		} catch (e) {
			error.message = "Server returned an invalid response format";
		}
		throw error;
	}

	return response.json();
};
