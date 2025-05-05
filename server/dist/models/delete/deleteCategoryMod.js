"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteCategoryMod = async ({ props }) => {
    try {
        const query = `
            DELETE FROM categories WHERE sport_id = ? AND category_id = ?
        `;
        await server_1.db.promise().query(query, [props.sportId, props.categoryId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Database error: " + error };
    }
};
exports.deleteCategoryMod = deleteCategoryMod;
//# sourceMappingURL=deleteCategoryMod.js.map