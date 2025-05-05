import genericApiResponse from "../GenericApiResponse";

export const verifyEmailRequest = async (token: string) => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";


	const response = await fetch(`http://${serverIp}/api/verify-email?token=${token}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const error = new Error(`Error - ${response.status}`);
		console.error(error);
		throw error;
	}

	const data = await response.json();

	if (!("status" in data) || !("message" in data)) {
		throw new Error("Invalid API response format");
	} else{
		console.log(data.status + ": " + data.message);
	}

	return data as genericApiResponse<null>; // FIXME
};
