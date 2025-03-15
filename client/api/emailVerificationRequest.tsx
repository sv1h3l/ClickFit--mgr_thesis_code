interface sendEmailError extends Error {
	status: number;
	message: string;
}

export const emailVerificationRequest = async (data: { email: string }) => {
	const response = await fetch("http://localhost:5000/api/send-email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error: sendEmailError = new Error() as sendEmailError;
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
