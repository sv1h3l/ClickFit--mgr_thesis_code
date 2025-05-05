import genericApiResponse from "../GenericApiResponse";

export const newPasswordRequest = async (requestData: {token: string; password: string; confirmPassword: string}) => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";

	const response = await fetch(`http://${serverIp}/api/new-password`, {
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

	return responseData as genericApiResponse<null>; // FIXME
};
