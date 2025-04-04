import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;

	seriesRepetitonsOrBurden: number;
	series?: number;
	repetitions?: number;
	burden?: number;
}

export const changeExerciseRecommendedValsMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const value = props.seriesRepetitonsOrBurden === 1 ? props.series : props.seriesRepetitonsOrBurden === 2 ? props.repetitions : props.seriesRepetitonsOrBurden === 3 ? props.burden : -1;

		if (value === -1) {
			return { status: GenEnum.FAILURE, message: `Předán nevalidní identifikátor změny doporučené hodnoty` };
		}

		const query = `
			UPDATE exercises
			SET ${props.seriesRepetitonsOrBurden === 1 ? "series" : props.seriesRepetitonsOrBurden === 2 ? "repetitions" : "burden"} = ?
			WHERE sport_id = ? AND exercise_id = ?
		`;

		await db.promise().query(query, [value, props.sportId, props.exerciseId]);

		return { status: GenEnum.SUCCESS, message: `Doporučené hodnoty pro ${props.seriesRepetitonsOrBurden === 1 ? "série" : props.seriesRepetitonsOrBurden === 2 ? "opakování" : "zátěž"} úspěšně změněny` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny doporučené hodnoty pro ${props.seriesRepetitonsOrBurden === 1 ? "série" : props.seriesRepetitonsOrBurden === 2 ? "opakování" : "zátěž"}` };
	}
};
