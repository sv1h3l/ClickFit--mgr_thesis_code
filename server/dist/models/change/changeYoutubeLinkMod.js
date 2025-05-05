"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeYoutubeLinkMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeYoutubeLinkMod = async ({ sportId, exerciseId, youtubeLink }) => {
    try {
        const query = `
				UPDATE exercises
				SET youtube_link = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;
        await server_1.db.promise().query(query, [youtubeLink, sportId, exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Odkaz na video úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny odkazu na video" };
    }
};
exports.changeYoutubeLinkMod = changeYoutubeLinkMod;
//# sourceMappingURL=changeYoutubeLinkMod.js.map