"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserAtrsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getAllUserAtrsMod = async (props) => {
    try {
        const query = `
			SELECT 
				user_id,
				subscription_id,
				email,
				first_name,
				last_name,
				age,
				sex,
				height,
				weight,
				health
			FROM users
			WHERE user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.userId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.FAILURE, message: "Uživatel nebyl nalezen" };
        }
        const user = rows[0];
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Veškeré informace o uživateli úspěšně předány", data: user };
    }
    catch (error) {
        console.error("Chyba databáze: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během předávání veskerých informací o uživateli" };
    }
};
exports.getAllUserAtrsMod = getAllUserAtrsMod;
//# sourceMappingURL=getAllUserAtrsMod.js.map