"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectionMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createConnectionMod = async (props) => {
    const connection = await server_1.db.promise().getConnection();
    try {
        await connection.beginTransaction();
        const insertQuery = `
			INSERT INTO connections (first_user_id, second_user_id)
			VALUES (?, ?)
		`;
        const [insertResult] = await connection.query(insertQuery, [props.firstUserId, props.secondUserId]);
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
        await connection.query(reorderFirstOrderNumbersQuery, [props.firstUserId]);
        await connection.query(reorderFirstOrderNumbersQuery, [props.secondUserId]);
        await connection.query(reorderSecondOrderNumbersQuery, [props.firstUserId]);
        await connection.query(reorderSecondOrderNumbersQuery, [props.secondUserId]);
        await connection.commit();
        connection.release();
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Spojení úspěšně navázáno", data: { connectionId } };
    }
    catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Database transaction error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během navazování spojení" };
    }
};
exports.createConnectionMod = createConnectionMod;
//# sourceMappingURL=createConnectionMod.js.map