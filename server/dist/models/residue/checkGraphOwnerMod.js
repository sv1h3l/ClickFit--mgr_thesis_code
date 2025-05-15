"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGraphOwnerMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkGraphOwnerMod = async (props) => {
    const checkQuery = `SELECT * FROM user_graphs WHERE user_id = ? AND graph_id = ? LIMIT 1`;
    try {
        const [userGraph] = await server_1.db.promise().query(checkQuery, [props.userId, props.graphId]);
        if (userGraph.length > 0) {
            return { status: GenResEnum_1.GenEnum.SUCCESS };
        }
        const sharedSports = `SELECT sport_id FROM shared_sports WHERE user_id = ?`;
        const [sportIds] = await server_1.db.promise().query(sharedSports, [props.userId]);
        for (const row of sportIds) {
            const sportId = row.sport_id;
            const [defGraph] = await server_1.db.promise().query(`SELECT * FROM default_graphs WHERE sport_id = ? AND graph_id = ? LIMIT 1`, [sportId, props.graphId]);
            if (defGraph.length > 0) {
                return { status: GenResEnum_1.GenEnum.SUCCESS };
            }
        }
        const ownedSharedSports = `SELECT sport_id FROM sports WHERE user_id = ?`;
        const [ownedSportIds] = await server_1.db.promise().query(ownedSharedSports, [props.userId]);
        for (const row of ownedSportIds) {
            const sportId = row.sport_id;
            const [defGraph] = await server_1.db.promise().query(`SELECT * FROM default_graphs WHERE sport_id = ? AND graph_id = ? LIMIT 1`, [sportId, props.graphId]);
            if (defGraph.length > 0) {
                return { status: GenResEnum_1.GenEnum.SUCCESS };
            }
        }
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkGraphOwnerMod = checkGraphOwnerMod;
//# sourceMappingURL=checkGraphOwnerMod.js.map