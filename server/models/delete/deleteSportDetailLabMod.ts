import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	sportDetailLabId: number;
}

export const deleteSportDetailLabMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM sport_detail_labels
			WHERE sport_id = ? AND sport_detail_label_id = ?
        `;

		await db.promise().query(query, [props.sportId, props.sportDetailLabId]);

		return { status: GenEnum.SUCCESS,  message: "Štítek podrobnosti sportu úspěšně odstraněna"};
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během odstraňování štítku podrobnosti sportu" };
	}
};
