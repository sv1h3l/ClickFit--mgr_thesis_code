"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrainingPlanViewMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkTrainingPlanViewMod = async (props) => {
    const checkQuery = `
		SELECT training_plan_id FROM training_plans
		WHERE training_plan_id = ? AND (owner_id = ? OR author_id = ?)
		LIMIT 1
	`;
    try {
        const [rows] = await server_1.db
            .promise()
            .query(checkQuery, [
            props.trainingPlanId,
            props.userId,
            props.userId,
        ]);
        if (rows.length > 0) {
            return { status: GenResEnum_1.GenEnum.SUCCESS };
        }
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
    catch (error) {
        console.error("Database error:", error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkTrainingPlanViewMod = checkTrainingPlanViewMod;
//# sourceMappingURL=checkTrainingPlanViewMod.js.map