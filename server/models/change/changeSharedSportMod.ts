import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;
	authorId: number;

	sportIsShared: boolean;
}

interface Res {
	sharedSportId: number;
}

export const changeSharedSportMod = async (props: Props): Promise<GenRes<Res>> => {
	let sharedSportId = undefined;

	try {
		if (props.sportIsShared) {
			const query = `
				DELETE FROM shared_sports
				WHERE user_id = ? AND sport_id = ? AND author_id = ?
			`;

			await db.promise().query(query, [props.userId, props.sportId, props.authorId]);

			return {
				status: GenEnum.SUCCESS,
				message: "Sport není sdílen",
			};
		} else {
			const query = `
				INSERT INTO shared_sports (user_id, sport_id, author_id)
				VALUES (?, ?, ?)
			`;

			const [result]: any = await db.promise().query(query, [props.userId, props.sportId, props.authorId]);

			return {
				status: GenEnum.SUCCESS,
				message: "Sport je sdílen",
				data: result.insertId,
			};
		}
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny sdílení sportu" };
	}
};
