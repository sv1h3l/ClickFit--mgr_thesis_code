import { Request, Response } from "express";
import { changeUnitCodeMod } from "../../models/change/changeUnitCodeMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { changeDiaryContentMod } from "../../models/change/changeDiaryContentMod";

export const changeDiaryContentCont = async (req: Request, res: Response): Promise<void> => {
	const { diaryId, content} = req.body;

	if (!diaryId || diaryId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID deníku." });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, id: diaryId, checkAuthorizationCode: CheckAuthorizationCodeEnum.DIARY_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await changeDiaryContentMod({ diaryId, content });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
