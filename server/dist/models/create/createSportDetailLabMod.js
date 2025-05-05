"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportDetailLabMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSportDetailLabMod = async (props) => {
    const checkQuery = `SELECT * FROM sport_detail_labels WHERE sport_id = ? AND label = ? LIMIT 1`;
    try {
        const [existingLabel] = await server_1.db.promise().query(checkQuery, [props.sportId, props.sportDetailLab]);
        if (existingLabel.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Štítek údaje sportu s tímto názvem již existuje" };
        }
        const query = `
				INSERT INTO sport_detail_labels (sport_id, label, order_number) 
				VALUES (?, ?, ?);
			`;
        const [result] = await server_1.db.promise().query(query, [props.sportId, props.sportDetailLab, props.orderNumber]);
        const sportDetailLabId = result.insertId;
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Štítek údaje sportu úspěšně vytvořen", data: sportDetailLabId };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření štítku údaje sportu" };
    }
};
exports.createSportDetailLabMod = createSportDetailLabMod;
//# sourceMappingURL=createSportDetailLabMod.js.map