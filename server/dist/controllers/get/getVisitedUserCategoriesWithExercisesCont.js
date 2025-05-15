"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserCategoriesWithExercisesCont = void 0;
const getCategoriesAndExercisesMod_1 = require("../../models/get/getCategoriesAndExercisesMod");
const getExercisesMod_1 = require("../../models/get/getExercisesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserCategoriesWithExercisesCont = async (req, res) => {
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
    const authToken = req.headers["authorization"]?.split(" ")[1];
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const categories = await (0, getCategoriesAndExercisesMod_1.getCategoriesAndExercisesMod)(sportIdNumber);
        const exercises = await (0, getExercisesMod_1.getExercisesMod)(sportIdNumber);
        if (categories.length > 0) {
            const formattedCategories = categories
                .map((category) => {
                // Filtrujeme a setřídíme všechny cviky, které mají stejné categoryId
                const categoryExercises = exercises.filter((exercise) => exercise.category_id === category.category_id).sort((a, b) => a.order_number - b.order_number); // Seřazení cviků
                return {
                    categoryId: category.category_id,
                    categoryName: category.category_name,
                    orderNumber: category.order_number,
                    description: category.description,
                    hasRepeatability: category.has_repeatability,
                    repeatabilityQuantity: category.repeatability_quantity,
                    looseConnection: category.loose_connection,
                    tightConnection: category.tight_connection,
                    priorityPoints: category.priority_points,
                    blacklist: category.blacklist,
                    shortMinQuantity: category.short_min_quantity,
                    shortMaxQuantity: category.short_max_quantity,
                    mediumMinQuantity: category.medium_min_quantity,
                    mediumMaxQuantity: category.medium_max_quantity,
                    longMinQuantity: category.long_min_quantity,
                    longMaxQuantity: category.long_max_quantity,
                    // Přidáme seřazené cviky do každé kategorie
                    exercises: categoryExercises.map((exercise) => ({
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
                    })),
                };
            })
                .sort((a, b) => (a.orderNumber === 0 ? 1 : b.orderNumber === 0 ? -1 : a.orderNumber - b.orderNumber)); // Seřazení kategorií
            res.status(200).json({ message: "Kategorie a cviky úspěšně předány.", data: formattedCategories });
        }
        else {
            res.status(200).json({ message: "Žádné kategorie nenalezeny.", data: [] }); // TODO: opravit status kód i u getSportsController
        }
    }
    catch (error) {
        console.error("Chyba při získání kategorií a cviků: ", error);
        res.status(500).json({ message: "Chyba při získání kategorií a cviků.", data: [] });
    }
};
exports.getVisitedUserCategoriesWithExercisesCont = getVisitedUserCategoriesWithExercisesCont;
//# sourceMappingURL=getVisitedUserCategoriesWithExercisesCont.js.map