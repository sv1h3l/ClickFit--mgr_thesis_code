"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnCodeMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkOwnCodeMod = async (props) => {
    const checkQuery = `
					SELECT * FROM users
					WHERE connection_code = ? AND user_id = ? LIMIT 1
				`;
    try {
        const [ownConnection] = await server_1.db.promise().query(checkQuery, [props.connectionCode, props.userId]);
        if (ownConnection.length > 0) {
            return { status: GenResEnum_1.GenEnum.BAD_REQUEST, message: "Nelze navázat spojení sám se sebou" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Uživatel nechce navázat spojení sám se sebou" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během hledání vlastního kód spojení" };
    }
};
exports.checkOwnCodeMod = checkOwnCodeMod;
//# sourceMappingURL=checkOwnCodeMod.js.map