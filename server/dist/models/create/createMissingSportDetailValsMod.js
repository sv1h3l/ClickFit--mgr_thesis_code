"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMissingSportDetailValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createMissingSportDetailValsMod = async (props) => {
    try {
        for (const detail of props.missingSportDetailIds) {
            let query = "";
            let values = [detail.sportDetailLabelId, props.userId];
            if (detail.orderNumber > 7) {
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id)
					VALUES (?, ?)
				`;
            }
            else if (detail.orderNumber === 1) {
                const value = "3";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(value);
            }
            else if (detail.orderNumber === 2) {
                const value = "4";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(value);
            }
            else if (detail.orderNumber === 3) {
                const value = "3";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(value);
            }
            else if (detail.orderNumber === 4) {
                const value = "5";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(value);
            }
            else if (detail.orderNumber === 5) {
                const value = "3";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(value);
            }
            else if (detail.orderNumber === 6) {
                const value = "6";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(value);
            }
            else {
                const [rows] = await server_1.db.promise().query("SELECT difficulty_name FROM sport_difficulties WHERE order_number = 1 AND sport_id = ?", [props.sportId]);
                const result = rows;
                const difficultyName = result[0]?.difficulty_name || "Neznámá";
                query = `
					INSERT INTO sport_detail_values (sport_detail_label_id, user_id, value)
					VALUES (?, ?, ?)
				`;
                values.push(difficultyName);
            }
            await server_1.db.promise().query(query, values);
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Prázdné hodnoty sportu úspěšně vytvořeny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření prázdných hodnot sportu" };
    }
};
exports.createMissingSportDetailValsMod = createMissingSportDetailValsMod;
//# sourceMappingURL=createMissingSportDetailValsMod.js.map