interface LoginError extends Error {
	status: number;
	message: string;
}

export const loginRequest = async (data: { email: string; password: string }) => {
	const response = await fetch("http://localhost:5000/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
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
