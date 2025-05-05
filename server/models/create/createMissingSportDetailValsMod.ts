import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;
	missingSportDetailIds: { sportDetailLabelId: number; orderNumber: number }[];
}

export const createMissingSportDetailValsMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		for (const detail of props.missingSportDetailIds) {
			let query = "";
			let values: any[] = [detail.sportDetailLabelId, props.userId];

			if (detail.orderNumber > 7) {
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id)
					VALUES (?, ?)
				`;
			} else if (detail.orderNumber === 1) {
				const value = "3";
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(value);
			} else if (detail.orderNumber === 2) {
				const value = "4";
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(value);
			} else if (detail.orderNumber === 3) {
				const value = "3";
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(value);
			} else if (detail.orderNumber === 4) {
				const value = "5";
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(value);
			} else if (detail.orderNumber === 5) {
				const value = "3";
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(value);
			} else if (detail.orderNumber === 6) {
				const value = "6";
				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(value);
			} else {
				const [rows] = await db.promise().query("SELECT difficulty_name FROM sport_difficulties WHERE order_number = 1 AND sport_id = ?", [props.sportId]);

				const result = rows as { difficulty_name: string }[];
				const difficultyName = result[0]?.difficulty_name || "Neznámá";

				query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
				values.push(difficultyName);
			}

			await db.promise().query<ResultSetHeader>(query, values);
		}

		return { status: GenEnum.SUCCESS, message: "Prázdné hodnoty sportu úspěšně vytvořeny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření prázdných hodnot sportu" };
	}
};
