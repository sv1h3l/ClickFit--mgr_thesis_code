import { Request, Response } from "express";
import { getDiaryMod } from "../../models/get/getDiaryMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { createDiaryMod } from "../../models/create/createDiaryMod";

export const getDiaryCont = async (req: Request, res: Response): Promise<void> => {
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

	/* TODO
	const checkRes = await checkAuthorizationController(req, sportIdNumber, CheckAuthorizationCodeEnum.SPORT_VIEW); 
	if (!checkRes.authorized) {
		res.status(401).json({ message: checkRes.message });
	}*/

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbGetDiaryRes = await getDiaryMod({ sportId: sportIdNumber, userId: userAtrs.data.userId });

		let formattedDiary;

		if (dbGetDiaryRes.status === GenEnum.SUCCESS && dbGetDiaryRes.data) {
			formattedDiary = {
				diaryId: dbGetDiaryRes.data.diary_id,
				sportId: sportId,
				content: dbGetDiaryRes.data.content,
			};
		} else if (dbGetDiaryRes.status === GenEnum.NOT_FOUND) {
			const dbCreateDiaryRes = await createDiaryMod({ sportId: sportIdNumber, userId: userAtrs.data.userId });

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
