"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingPlansMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getTrainingPlansMod = async (props) => {
    try {
        const query = `
				SELECT 
					tp.training_plan_id AS trainingPlanId,
					tp.sport_id AS sportId,
					tp.author_id AS authorId,
					tp.owner_id AS ownerId,
					tp.name,
					s.sport_name AS sportName,
					CONCAT(u.first_name, ' ', u.last_name) AS authorName,
					tp.order_number AS orderNumber,
					tp.date_of_creation AS dateOfCreation,
					tp.can_owner_edit AS canOwnerEdt,
					tp.has_burden_and_unit AS hasBurdenAndUnit,
					tp.unit_code AS unitCode
				FROM training_plans tp
				JOIN sports s ON tp.sport_id = s.sport_id
				JOIN users u ON tp.author_id = u.user_id
				WHERE tp.owner_id = ? OR tp.author_id = ?
				ORDER BY tp.order_number ASC;
			`;
        const [rows] = await server_1.db.promise().query(query, [props.userId, props.userId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Tréninkové plány úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání tréninkových plánů" };
    }
};
exports.getTrainingPlansMod = getTrainingPlansMod;
//# sourceMappingURL=getTrainingPlansMod.js.map