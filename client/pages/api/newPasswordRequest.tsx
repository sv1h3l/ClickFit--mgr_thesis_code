import genericApiResponse from "./GenericApiResponse";

export const newPasswordRequest = async (requestData: {token: string; password: string; confirmPassword: string}) => {

	console.log(requestData.token);

	const response = await fetch(`http://localhost:5000/api/new-password`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	});

	if (!response.ok) {
		const error = new Error();
		(error as any).statusCode = response.status;

		const errorData = await response.json();
		(error as any).errors = errorData.errors;

		throw error;
	}

	const responseData = await response.json();

	if (!("status" in responseData) || !("message" in responseData)) {
		throw new Error("Invalid API response format");
	} else{
		console.log(responseData.status + ": " + responseData.message);
	}

	return responseData as genericApiResponse;
};
