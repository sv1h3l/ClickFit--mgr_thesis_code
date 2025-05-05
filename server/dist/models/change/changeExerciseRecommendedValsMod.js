"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseRecommendedValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseRecommendedValsMod = async (props) => {
    try {
        const value = props.seriesRepetitonsOrBurden === 1 ? props.series : props.seriesRepetitonsOrBurden === 2 ? props.repetitions : props.seriesRepetitonsOrBurden === 3 ? props.burden : -1;
        if (value === -1) {
            return { status: GenResEnum_1.GenEnum.FAILURE, message: `Předán nevalidní identifikátor změny doporučené hodnoty` };
        }
        const query = `
			UPDATE exercises
			SET ${props.seriesRepetitonsOrBurden === 1 ? "series" : props.seriesRepetitonsOrBurden === 2 ? "repetitions" : "burden"} = ?
			WHERE sport_id = ? AND exercise_id = ?
		`;
        await server_1.db.promise().query(query, [value, props.sportId, props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Doporučené hodnoty pro ${props.seriesRepetitonsOrBurden === 1 ? "série" : props.seriesRepetitonsOrBurden === 2 ? "opakování" : "zátěž"} úspěšně změněny` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny doporučené hodnoty pro ${props.seriesRepetitonsOrBurden === 1 ? "série" : props.seriesRepetitonsOrBurden === 2 ? "opakování" : "zátěž"}` };
    }
};
exports.changeExerciseRecommendedValsMod = changeExerciseRecommendedValsMod;
//# sourceMappingURL=changeExerciseRecommendedValsMod.js.map