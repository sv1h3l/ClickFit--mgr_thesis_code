"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveSportDetailLabelMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveSportDetailLabelMod = async (props) => {
    try {
        props.reorderSportDetailLabels.map(async (label) => {
            const query = `
				UPDATE sport_detail_labels
				SET order_number = ?
				WHERE sport_id = ? AND sport_detail_label_id = ?
			`;
            await server_1.db.promise().query(query, [label.orderNumber, props.sportId, label.sportDetailLabId]);
        });
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Podrobnosti sportu úspěšně přeuspořádány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání podrobností sportu" };
    }
};
exports.moveSportDetailLabelMod = moveSportDetailLabelMod;
//# sourceMappingURL=moveSportDetailLabelMod.js.map