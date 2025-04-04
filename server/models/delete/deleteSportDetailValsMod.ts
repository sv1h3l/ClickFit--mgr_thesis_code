import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportDetailLabId: number;
}

export const deleteSportDetailValsMod = async ( props: Props ): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM sport_detail_values
			WHERE sport_detail_label_id = ?
       	`;

		await db.promise().query(query, [props.sportDetailLabId]);

		return { status: GenEnum.SUCCESS, message: "Hodnoty podrobností sportu úspěšně odstraněny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během odstraňování hodnot podrobností sportu" };
	}
};
