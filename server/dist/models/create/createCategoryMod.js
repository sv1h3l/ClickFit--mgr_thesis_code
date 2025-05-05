"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryMod = exports.CategoryCreationStatus = void 0;
const server_1 = require("../../server");
var CategoryCreationStatus;
(function (CategoryCreationStatus) {
    CategoryCreationStatus[CategoryCreationStatus["SUCCESS"] = 0] = "SUCCESS";
    CategoryCreationStatus[CategoryCreationStatus["ALREADY_EXISTS"] = 1] = "ALREADY_EXISTS";
    CategoryCreationStatus[CategoryCreationStatus["FAILURE"] = 2] = "FAILURE";
})(CategoryCreationStatus || (exports.CategoryCreationStatus = CategoryCreationStatus = {}));
const createCategoryMod = async (sportId, categoryName) => {
    const checkQuery = `SELECT * FROM categories WHERE sport_id = ? AND category_name = ? LIMIT 1`;
    try {
        const [existingCategory] = await server_1.db.promise().query(checkQuery, [sportId, categoryName]);
        if (existingCategory.length > 0) {
            return { status: CategoryCreationStatus.ALREADY_EXISTS };
        }
        const insertQuery = `
            INSERT INTO categories (sport_id, category_name, order_number, description)
            VALUES (?, ?, 1, "Zde je vhodné napsat popis kategorie.")
        `;
        // Perform the insert
        const [result] = await server_1.db.promise().query(insertQuery, [sportId, categoryName]);
        const categoryId = result.insertId; // FIXME je insertId správné ?
        return { status: CategoryCreationStatus.SUCCESS, categoryId: categoryId };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: CategoryCreationStatus.FAILURE };
    }
};
exports.createCategoryMod = createCategoryMod;
//# sourceMappingURL=createCategoryMod.js.map