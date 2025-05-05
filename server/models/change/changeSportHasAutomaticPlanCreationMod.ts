import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	hasAutomaticPlanCreation: boolean;
}

export const changeSportHasAutomaticPlanCreationMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sports
				SET has_automatic_plan_creation = ?
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.hasAutomaticPlanCreation, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Automatická tvorba tréninku úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny automatické tvorby tréninku" };
	}
};
