"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesCont = void 0;
const getExercisesMod_1 = require("../../models/get/getExercisesMod");
const getExercisesCont = async (req, res) => {
    const { sportId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        // Kontrola, jestli to je validní číslo
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    try {
        const exercises = await (0, getExercisesMod_1.getExercisesMod)(sportIdNumber); // Získáme sporty
        if (exercises.length > 0) {
            // Mapujeme sport z databázového formátu (snake_case) na formát camelCase
            const formattedExercises = exercises
                .map((exercise) => ({
                exerciseId: exercise.exercise_id,
                categoryId: exercise.category_id,
                sportDifficultyId: exercise.sport_difficulty_id,
                exerciseName: exercise.name,
                orderNumber: exercise.order_number,
                orderNumberWithoutCategories: exercise.order_number_without_categories,
                series: exercise.series,
                repetitions: exercise.repetitions,
                burden: exercise.burden,
                unitCode: exercise.unit_code,
                description: exercise.description,
                youtubeLink: exercise.youtube_link,
                hasRepeatability: exercise.has_repeatability,
                repeatabilityQuantity: exercise.repeatability_quantity,
                looseConnection: exercise.loose_connection,
                tightConnection: exercise.tight_connection,
                priorityPoints: exercise.priority_points,
                blacklist: exercise.blacklist,
            }))
                .sort((a, b) => a.orderNumberWithoutCategories - b.orderNumberWithoutCategories);
            res.status(200).json({ message: "Cviky úspěšně předány.", data: formattedExercises });
        }
        else {
            res.status(200).json({ message: "Žádné cviky nenalezeny.", data: [] }); // TODO: opravit kód i u getSportsController
        }
    }
    catch (error) {
        console.error("Chyba při získání cviků: ", error);
        res.status(500).json({ message: "Chyba při získání cviků.", data: [] });
    }
};
exports.getExercisesCont = getExercisesCont;
//# sourceMappingURL=getExercisesCont.js.map