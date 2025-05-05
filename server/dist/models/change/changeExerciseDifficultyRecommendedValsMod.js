"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseDifficultyRecommendedValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseDifficultyRecommendedValsMod = async (props) => {
    try {
        const value = props.seriesRepetitonsOrBurden === 1 ? props.series : props.seriesRepetitonsOrBurden === 2 ? props.repetitions : props.seriesRepetitonsOrBurden === 3 ? props.burden : -1;
        if (value === -1) {
            return { status: GenResEnum_1.GenEnum.FAILURE, message: `Předán nevalidní identifikátor změny doporučené hodnoty obtížnosti` };
        }
        const query = `
			UPDATE exercise_difficulties
			SET ${props.seriesRepetitonsOrBurden === 1 ? "series" : props.seriesRepetitonsOrBurden === 2 ? "repetitions" : "burden"} = ?
			WHERE exercise_id = ? AND exercise_difficulty_id = ?
		`;
        await server_1.db.promise().query(query, [value, props.exerciseId, props.exerciseDifficultyId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Doporučené hodnoty obtížnosti pro ${props.seriesRepetitonsOrBurden === 1 ? "série" : props.seriesRepetitonsOrBurden === 2 ? "opakování" : "zátěž"} úspěšně změněny` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny doporučené hodnoty obtížnosti pro ${props.seriesRepetitonsOrBurden === 1 ? "série" : props.seriesRepetitonsOrBurden === 2 ? "opakování" : "zátěž"}` };
    }
};
exports.changeExerciseDifficultyRecommendedValsMod = changeExerciseDifficultyRecommendedValsMod;
//# sourceMappingURL=changeExerciseDifficultyRecommendedValsMod.js.map