"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserTrainingPlanCreationPropsCont = void 0;
const getAllExerciseDifficultiesMod_1 = require("../../models/get/getAllExerciseDifficultiesMod");
const getCategoriesAndExercisesMod_1 = require("../../models/get/getCategoriesAndExercisesMod");
const getExercisesMod_1 = require("../../models/get/getExercisesMod");
const getSportMod_1 = require("../../models/get/getSportMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserTrainingPlanCreationPropsCont = async (req, res) => {
    const { sportId } = req.query;
    const sportIdNumber = Number(sportId);
    if (!sportId || sportIdNumber === -1) {
        res.status(400).json({ message: "Nevalidní ID sportu", data: [] });
        return;
    }
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token", data: [] });
        return;
    }
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
        const sport = await (0, getSportMod_1.getSportMod)({ sportId: sportIdNumber });
        const clientTypeSport = {
            userId: sport.data?.user_id,
            userEmail: "",
            userName: "",
            canUserEdit: false,
            sportId: sport.data?.sport_id,
            sportName: sport.data?.sport_name,
            hasCategories: sport.data?.has_categories,
            hasDifficulties: sport.data?.has_difficulties,
            hasRecommendedValues: sport.data?.has_recommended_values,
            hasRecommendedDifficultyValues: sport.data?.has_recommended_difficulty_values,
            unitCode: sport.data?.unit_code,
            description: sport.data?.description,
        };
        const exercises = await (0, getExercisesMod_1.getExercisesMod)(sportIdNumber);
        let clientTypeCategories;
        let clientTypeExercises;
        if (clientTypeSport.hasCategories) {
            const categories = await (0, getCategoriesAndExercisesMod_1.getCategoriesAndExercisesMod)(sportIdNumber);
            clientTypeCategories = categories
                .map((category) => {
                const categoryExercises = exercises.filter((exercise) => exercise.category_id === category.category_id).sort((a, b) => a.order_number - b.order_number);
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
                .sort((a, b) => (a.orderNumber === 0 ? 1 : b.orderNumber === 0 ? -1 : a.orderNumber - b.orderNumber));
        }
        else {
            clientTypeExercises = exercises
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
            }))
                .sort((a, b) => a.orderNumberWithoutCategories - b.orderNumberWithoutCategories);
        }
        let clientTypeExerciseDifficulties;
        if (clientTypeSport.hasRecommendedDifficultyValues) {
            const difficulties = await (0, getAllExerciseDifficultiesMod_1.getAllExerciseDifficultiesMod)({ sportId: sportIdNumber });
            clientTypeExerciseDifficulties = difficulties.data?.map((difficulty) => ({
                exerciseDifficultyId: difficulty.exercise_difficulty_id,
                sportDifficultyId: difficulty.sport_difficulty_id,
                exerciseId: difficulty.exercise_id,
                series: difficulty.series,
                repetitions: difficulty.repetitions,
                burden: difficulty.burden,
                orderNumber: difficulty.orderNumber,
            }));
        }
        res.status(200).json({
            message: "Props pro tvorbu tréninkového plánu úspěšně předány",
            data: {
                sport: clientTypeSport,
                categoriesWithExercises: clientTypeCategories ? clientTypeCategories : [],
                exercises: clientTypeExercises ? clientTypeExercises : [],
                recommendedDifficultyVals: clientTypeExerciseDifficulties ? clientTypeExerciseDifficulties : [],
            },
        });
    }
    catch (error) {
        console.error("Chyba při získání sportů: ", error);
        res.status(500).json({ message: "Chyba při získání sportů.", data: [] });
    }
};
exports.getVisitedUserTrainingPlanCreationPropsCont = getVisitedUserTrainingPlanCreationPropsCont;
//# sourceMappingURL=getVisitedUserTrainingPlanCreationPropsCont.js.map