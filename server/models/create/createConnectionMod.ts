import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	firstUserId: number;
	secondUserId: number;
}

export const createConnectionMod = async (props: Props): Promise<GenRes<{ connectionId: number }>> => {
	const connection = await db.promise().getConnection();

	try {
		await connection.beginTransaction();

		const insertQuery = `
			INSERT INTO connections (first_user_id, second_user_id)
			VALUES (?, ?)
		`;
		const [insertResult] = await connection.query<ResultSetHeader>(insertQuery, [props.firstUserId, props.secondUserId]);
		const connectionId = insertResult.insertId;

		const reorderFirstOrderNumbersQuery = `
			UPDATE connections
			SET first_user_order_number = first_user_order_number + 1
			WHERE first_user_id = ?
		`;
		const reorderSecondOrderNumbersQuery = `
			UPDATE connections
			SET second_user_order_number = second_user_order_number + 1
			WHERE second_user_id = ?
		`;

		await connection.query<ResultSetHeader>(reorderFirstOrderNumbersQuery, [props.firstUserId]);
		await connection.query<ResultSetHeader>(reorderFirstOrderNumbersQuery, [props.secondUserId]);
		await connection.query<ResultSetHeader>(reorderSecondOrderNumbersQuery, [props.firstUserId]);
		await connection.query<ResultSetHeader>(reorderSecondOrderNumbersQuery, [props.secondUserId]);

		await connection.commit();
		connection.release();

		return { status: GenEnum.SUCCESS, message: "Spojení úspěšně navázáno", data: { connectionId } };
	} catch (error) {
		await connection.rollback();
		connection.release();
		console.error("Database transaction error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během navazování spojení" };
	}
};
