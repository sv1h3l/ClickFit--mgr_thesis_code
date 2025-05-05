"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSharedSportMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSharedSportMod = async (props) => {
    const insertQuery = `
			INSERT INTO shared_sports (user_id, sport_id)
			VALUES (?, ?)
		`;
    try {
        await server_1.db.promise().query(insertQuery, [props.userId, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Sport úspěšně sdílen" };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během sdílení sportu" };
    }
};
exports.createSharedSportMod = createSharedSportMod;
//# sourceMappingURL=createSharedSportMod.js.map