"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSportDetailValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteSportDetailValsMod = async (props) => {
    try {
        const query = `
            DELETE FROM sport_detail_values
			WHERE sport_detail_label_id = ?
       	`;
        await server_1.db.promise().query(query, [props.sportDetailLabId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnoty podrobností sportu úspěšně odstraněny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během odstraňování hodnot podrobností sportu" };
    }
};
exports.deleteSportDetailValsMod = deleteSportDetailValsMod;
//# sourceMappingURL=deleteSportDetailValsMod.js.map