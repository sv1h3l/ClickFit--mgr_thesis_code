import { Request, Response } from "express";
import { getExerciseInformationLabelsModel } from "../../models/get/getExerciseInformationLabelsModel";

export const getExerciseInformationLabelsController = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query;

	if (!sportId) {
		res.status(400).json({ message: "Chybějící ID sportu", data: [] });
		return;
	}

	const sportIdNumber = Number(sportId);

	if (isNaN(sportIdNumber)) {
		// Kontrola, jestli to je validní číslo
		res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
		return;
	}

	try {
		const dbRes = await getExerciseInformationLabelsModel(sportIdNumber);

		if (dbRes.length > 0) {
			const exerciseInformationLabels = dbRes
				.map((exerciseInformationLabel) => {
					return {
						exerciseInformationLabelId: exerciseInformationLabel.exercise_information_labels_id,
						label: exerciseInformationLabel.label,
						orderNumber: exerciseInformationLabel.order_number,
					};
				})
				.sort((a, b) => a.orderNumber - b.orderNumber);

			res.status(200).json({ message: "Informace o cviku úspěšně předány", data: exerciseInformationLabels });
		} else {
			res.status(200).json({ message: "Sport nemá žádné informace o cviku", data: {} });
		}
	} catch (error) {
		console.error("Chyba při získání informací o cviku: ", error);
		res.status(500).json({ message: "Chyba při získání informací o cviku", data: [] });
	}
};
