import { TrainingPlan } from "@/components/large/TrainingPlansAndCreation";
import { GenericResponse } from "../GenericApiResponse";
const cookie = require("cookie");

interface Props {
	authToken: string;
}

interface Res {
	userId: number;
	trainingPlans: TrainingPlan[];
}

export const getTrainingPlansReq = async (props: Props): Promise<GenericResponse<Res>> => {
	const serverIp = process.env.NEXT_PUBLIC_SERVER_IP || "localhost:5000";
	try {
		const response = await fetch(`http://${serverIp}/api/get-training-plans`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${props.authToken}`,
				"Content-Type": "application/json",
			},
		});

		const responseData = await response.json().catch(() => ({
			message: "Server returned an invalid response format",
		}));

		return {
			status: response.status,
			message: responseData.message,
			data: responseData.data || [],
		};
	} catch {
		return {
			status: 500,
			message: "Network error or server unreachable",
		};
	}
};
