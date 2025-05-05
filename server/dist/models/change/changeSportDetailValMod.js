"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportDetailValMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportDetailValMod = async (props) => {
    try {
        const query = `
				UPDATE sport_detail_values
				SET value = ?
				WHERE user_id = ? AND sport_detail_value_id = ?
			`;
        await server_1.db.promise().query(query, [props.sportDetailVal, props.userId, props.sportDetailValId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnota údaje sportu úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny hodnoty údaje sportu" };
    }
};
exports.changeSportDetailValMod = changeSportDetailValMod;
//# sourceMappingURL=changeSportDetailValMod.js.map