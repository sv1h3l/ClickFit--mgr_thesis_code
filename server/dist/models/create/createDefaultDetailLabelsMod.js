"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultDetailLabelsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createDefaultDetailLabelsMod = async (sportId) => {
    try {
        const insertQuery = `
            INSERT INTO sport_detail_labels (sport_id, label, order_number)
            VALUES
				(?, "Minimální počet tréninkových dní", 1),
				(?, "Maximální počet tréninkových dní", 2),
				(?, "Minimální počet kategorií pro jednotlivé dny", 3),
				(?, "Maximální počet kategorií pro jednotlivé dny", 4),
				(?, "Minimální počet cviků pro jednotlivé kategorie", 5),
				(?, "Maximální počet cviků pro jednotlivé kategorie", 6),
				(?, "Obtížnost cviků", 7);
        `;
        await server_1.db.promise().query(insertQuery, [sportId, sportId, sportId, sportId, sportId, sportId, sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.createDefaultDetailLabelsMod = createDefaultDetailLabelsMod;
//# sourceMappingURL=createDefaultDetailLabelsMod.js.map