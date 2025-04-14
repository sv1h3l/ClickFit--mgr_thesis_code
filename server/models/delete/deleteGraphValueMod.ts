import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphValueId: number;
}

export const deleteGraphValueMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM graph_values WHERE graph_value_id = ?
        `;

		await db.promise().query(query, [props.graphValueId]);

		return { status: GenEnum.SUCCESS, message: "Záznam grafu úspěšně smazán" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během mazání záznamu grafu" };
	}
};
