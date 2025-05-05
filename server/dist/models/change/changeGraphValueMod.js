"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeGraphValueMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeGraphValueMod = async (props) => {
    try {
        const query = `
				UPDATE graph_values
				SET y_axis_value = ?, x_axis_value = ?
				WHERE graph_value_id = ?
			`;
        const [result] = await server_1.db.promise().query(query, [props.yAxisValue, props.xAxisValue, props.graphValueId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznam grafu úspěšně vytvořen" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření uživatelského grafu" };
    }
};
exports.changeGraphValueMod = changeGraphValueMod;
//# sourceMappingURL=changeGraphValueMod.js.map