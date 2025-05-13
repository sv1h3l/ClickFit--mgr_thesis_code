import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	graphId: number;
}

export const checkGraphOwnerMod = async (props: Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM user_graphs WHERE user_id = ? AND graph_id = ? LIMIT 1`;

	try {
		const [userGraph] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.userId, props.graphId]);

		if (userGraph.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		const sharedSports = `SELECT sport_id FROM shared_sports WHERE user_id = ?`;
		const [sportIds] = await db.promise().query<RowDataPacket[]>(sharedSports, [props.userId]);

		for (const row of sportIds as RowDataPacket[]) {
			const sportId = row.sport_id;
			const [defGraph] = await db.promise().query<RowDataPacket[]>(`SELECT * FROM default_graphs WHERE sport_id = ? AND graph_id = ? LIMIT 1`, [sportId, props.graphId]);

			if (defGraph.length > 0) {
				return { status: GenEnum.SUCCESS };
			}
		}

		const ownedSharedSports = `SELECT sport_id FROM sports WHERE user_id = ?`;
		const [ownedSportIds] = await db.promise().query<RowDataPacket[]>(ownedSharedSports, [props.userId]);

		for (const row of ownedSportIds as RowDataPacket[]) {
			const sportId = row.sport_id;
			const [defGraph] = await db.promise().query<RowDataPacket[]>(`SELECT * FROM default_graphs WHERE sport_id = ? AND graph_id = ? LIMIT 1`, [sportId, props.graphId]);

			if (defGraph.length > 0) {
				return { status: GenEnum.SUCCESS };
			}
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};
