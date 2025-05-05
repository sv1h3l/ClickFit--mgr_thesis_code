"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiaryMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createDiaryMod = async (props) => {
    try {
        const emptyContent = "";
        const query = `
            INSERT INTO diaries (sport_id, user_id, content)
            VALUES (?, ?, ?)
        `;
        // Perform the insert
        const [result] = await server_1.db.promise().query(query, [props.sportId, props.userId, emptyContent]);
        const diary_id = result.insertId;
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Deník úspěšně vytvořen", data: { sport_id: props.sportId, diary_id: diary_id } };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření deníku" };
    }
};
exports.createDiaryMod = createDiaryMod;
//# sourceMappingURL=createDiaryMod.js.map