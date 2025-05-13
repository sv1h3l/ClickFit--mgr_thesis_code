import { Request, Response } from "express";
import { createDiaryMod } from "../../models/create/createDiaryMod";
import { getDiaryMod } from "../../models/get/getDiaryMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { checkAuthorizationCont, CheckAuthorizationCodeEnum } from "../residue/checkAuthorizationCont";

export const getVisitedUserDiaryCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId } = req.query;

	if (!sportId) {
		res.status(400).json({ message: "Chybějící ID sportu", data: [] });
		return;
	}

	const sportIdNumber = Number(sportId);
	if (isNaN(sportIdNumber)) {
		res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
		return;
	}

	const visitedUserId = Number(req.query.visitedUserId);

	if (!visitedUserId || visitedUserId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}

	const checkRes = await checkAuthorizationCont({ req, id: visitedUserId, checkAuthorizationCode: CheckAuthorizationCodeEnum.USER_VISIT });
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {

		const dbGetDiaryRes = await getDiaryMod({ sportId: sportIdNumber, userId: visitedUserId });

		let formattedDiary;

		if (dbGetDiaryRes.status === GenEnum.SUCCESS && dbGetDiaryRes.data) {
			formattedDiary = {
				diaryId: dbGetDiaryRes.data.diary_id,
				sportId: sportId,
				content: dbGetDiaryRes.data.content,
			};
		} else if (dbGetDiaryRes.status === GenEnum.NOT_FOUND) {
			const dbCreateDiaryRes = await createDiaryMod({ sportId: sportIdNumber, userId: visitedUserId });

			if (dbCreateDiaryRes.status === GenEnum.SUCCESS && dbCreateDiaryRes.data)
				formattedDiary = {
					diaryId: dbCreateDiaryRes.data.diary_id,
					sportId: sportId,
					content: "",
				};

			res.status(dbCreateDiaryRes.status).json({ message: dbCreateDiaryRes.message, data: formattedDiary });
			return;
		}

		res.status(dbGetDiaryRes.status).json({ message: dbGetDiaryRes.message, data: formattedDiary });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
