"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAtrFromAuthTokenMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const cookie = require("cookie");
const getUserAtrFromAuthTokenMod = async (props) => {
    let concreteAuthToken;
    if (props.authToken && props.authToken !== "undefined") {
        concreteAuthToken = props.authToken;
    }
    else {
        const cookies = cookie.parse(props.req.headers.cookie || "");
        concreteAuthToken = cookies.authToken || null;
    }
    const query = `SELECT user_id, email FROM users WHERE auth_token = ?`;
    try {
        const [results] = await server_1.db.promise().query(query, [concreteAuthToken]);
        if (results.length === 0) {
            console.error("Uživatel nenalezen");
            return { status: GenResEnum_1.GenEnum.FAILURE, message: "Uživatel nenalezen", data: { userId: -1, userEmail: "" } };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Uživatel úspěšně nalezen", data: { userId: results[0].user_id, userEmail: results[0].email } };
    }
    catch (error) {
        console.error("Databázová chyba: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Uživatel nenalezen", data: { userId: -1, userEmail: "" } };
    }
};
exports.getUserAtrFromAuthTokenMod = getUserAtrFromAuthTokenMod;
//# sourceMappingURL=getUserAtrFromAuthTokenMod.js.map