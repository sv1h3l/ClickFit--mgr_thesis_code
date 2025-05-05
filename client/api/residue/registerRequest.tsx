export const registerRequest = async (data: { name: string; surname: string; email: string; password: string; confirmPassword: string }) => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";
	
	
	const response = await fetch(`http://${serverIp}/api/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = new Error();
		(error as any).statusCode = response.status;

		const errorData = await response.json();
		(error as any).errors = errorData.errors;

		throw error;
	}

	return response.json(); // Vrátí odpověď, pokud byla registrace úspěšná
};
