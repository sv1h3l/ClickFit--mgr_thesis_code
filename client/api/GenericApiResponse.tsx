// Upravíme GenericApiResponse, aby byla generická
export interface GenericResponse<T> {
	status: number;
	message: string;
	user?: string;
	data?: T; // Typ dat bude dynamický
}

export const consoleLogPrint = <T,>(response: GenericResponse<T>) => {
	if (response.status >= 200 && response.status < 300) {
		console.log("Kód: ", response.status, "\nZpráva:", response.message, "\nData:", response.data);
	} else {
		console.error("Kód: ", response.status, "\nZpráva:", response.message);
	}
};

export default GenericResponse;
