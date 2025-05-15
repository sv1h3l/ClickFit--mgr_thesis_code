"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSharedSportMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSharedSportMod = async (props) => {
    let sharedSportId = undefined;
    try {
        if (props.sportIsShared) {
            const query = `
				DELETE FROM shared_sports
				WHERE user_id = ? AND sport_id = ? AND author_id = ?
			`;
            await server_1.db.promise().query(query, [props.userId, props.sportId, props.authorId]);
            return {
                status: GenResEnum_1.GenEnum.SUCCESS,
                message: "Sport není sdílen",
            };
        }
        else {
            const query = `
				INSERT INTO shared_sports (user_id, sport_id, author_id)
				VALUES (?, ?, ?)
			`;
            const [result] = await server_1.db.promise().query(query, [props.userId, props.sportId, props.authorId]);
            return {
                status: GenResEnum_1.GenEnum.SUCCESS,
                message: "Sport je sdílen",
                data: result.insertId,
            };
        }
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny sdílení sportu" };
    }
};
exports.changeSharedSportMod = changeSharedSportMod;
//# sourceMappingURL=changeSharedSportMod.js.map