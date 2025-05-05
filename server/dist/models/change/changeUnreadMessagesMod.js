"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUnreadMessagesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUnreadMessagesMod = async (props) => {
    try {
        // Získáme info o připojení pro určení, zda je user první nebo druhý
        const [rows] = await server_1.db.promise().query(`SELECT first_user_id, second_user_id FROM connections WHERE connection_id = ?`, [props.connectionId]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.FAILURE, message: "Spojení nenalezeno" };
        }
        const connection = rows[0];
        let query = "";
        if (props.userId === connection.first_user_id) {
            query = `UPDATE connections SET first_user_unread_messages = 0 WHERE connection_id = ?`;
        }
        else if (props.userId === connection.second_user_id) {
            query = `UPDATE connections SET second_user_unread_messages = 0 WHERE connection_id = ?`;
        }
        else {
            return { status: GenResEnum_1.GenEnum.FAILURE, message: "Uživatel není součástí spojení" };
        }
        await server_1.db.promise().query(query, [props.connectionId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Nepřečtené zprávy označeny jako přečtené" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během označení zpráv jako přečtené" };
    }
};
exports.changeUnreadMessagesMod = changeUnreadMessagesMod;
//# sourceMappingURL=changeUnreadMessagesMod.js.map