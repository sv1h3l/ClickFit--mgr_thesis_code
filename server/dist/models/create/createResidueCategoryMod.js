"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResidueCategoryMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createResidueCategoryMod = async (sportId) => {
    try {
        const insertQuery = `
            INSERT INTO categories (sport_id, category_name, order_number)
            VALUES (?, "Ostatní", 0)
        `;
        await server_1.db.promise().query(insertQuery, [sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.createResidueCategoryMod = createResidueCategoryMod;
//# sourceMappingURL=createResidueCategoryMod.js.map