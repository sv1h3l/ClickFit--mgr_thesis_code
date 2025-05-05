"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSportDetailLabMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteSportDetailLabMod = async (props) => {
    try {
        const query = `
            DELETE FROM sport_detail_labels
			WHERE sport_id = ? AND sport_detail_label_id = ?
        `;
        await server_1.db.promise().query(query, [props.sportId, props.sportDetailLabId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Štítek podrobnosti sportu úspěšně odstraněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během odstraňování štítku podrobnosti sportu" };
    }
};
exports.deleteSportDetailLabMod = deleteSportDetailLabMod;
//# sourceMappingURL=deleteSportDetailLabMod.js.map