"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDiaryContentMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeDiaryContentMod = async (props) => {
    try {
        const query = `
				UPDATE diaries
				SET content = ?
				WHERE diary_id = ?
			`;
        await server_1.db.promise().query(query, [props.content, props.diaryId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obsah deníku úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny obsahu deníku" };
    }
};
exports.changeDiaryContentMod = changeDiaryContentMod;
//# sourceMappingURL=changeDiaryContentMod.js.map