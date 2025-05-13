import { db } from "../../server"; // Import připojení k DB


export interface Res {
	shared_sport_id: number;
	sport_id: number;
	user_id: number;
	author_id: number;
}

interface Props{
	authorId: number;
	userId: number;
}

export const getSharedSportsMod = async (props: Props): Promise<Res[]> => {
	try {
		const query = `
			SELECT 
				shared_sport_id, 
				sport_id, 
				user_id, 
				author_id
			FROM shared_sports
			WHERE author_id = ? AND user_id = ?
		`;

		const [rows] = await db.promise().query(query, [props.authorId, props.userId]);
		return rows as Res[];
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};
