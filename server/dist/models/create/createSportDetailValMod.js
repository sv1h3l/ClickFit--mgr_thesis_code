"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportDetailValMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSportDetailValMod = async (props) => {
    try {
        const query = `
				INSERT INTO sport_detail_values (sport_detail_label_id, user_id)
				VALUES (?, ?)
			`;
        const [result] = await server_1.db.promise().query(query, [props.sport_detail_label_id, props.userId]);
        const sportDetailValId = result.insertId;
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnota údaje sportu úspěšně vytvořena", data: sportDetailValId };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření hodnoty údaje sportu" };
    }
};
exports.createSportDetailValMod = createSportDetailValMod;
//# sourceMappingURL=createSportDetailValMod.js.map