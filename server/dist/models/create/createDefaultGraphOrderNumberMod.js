"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultGraphOrderNumberMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createDefaultGraphOrderNumberMod = async (props) => {
    try {
        const query = `
            INSERT INTO default_graphs_order_numbers (graph_id, user_id, order_number)
            VALUES (?, ?, ?)
        `;
        const [result] = await server_1.db.promise().query(query, [props.graphId, props.userId, props.highestOrderNumber]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně vytvořeno", data: { defaultGraphOrderNumberId: result.insertId } };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření pořadí výchozího grafu" };
    }
};
exports.createDefaultGraphOrderNumberMod = createDefaultGraphOrderNumberMod;
//# sourceMappingURL=createDefaultGraphOrderNumberMod.js.map