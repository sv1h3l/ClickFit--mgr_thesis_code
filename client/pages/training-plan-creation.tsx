import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import SingleColumnPage from "@/components/SingleColumnPage";
import { Box, Button, Typography, Menu, MenuItem } from "@mui/material";
import Title from "@/components/Title";
import GeneralCard from "@/components/GeneralCard";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"; // Import ikon šipek

const options = ["Záda", "Ramena", "Biceps", "Triceps", "Prsa"];
const exerciseOptions = ["Deadlift", "Bench Press", "Squat", "Pull-up", "Push-up", "Stahování horní kladky nadhmatem ve stoje"];

export interface Day {
    nthDay: number;
    categories: Category[];
}

interface Category {
    nthDay: number;
    nthCategory: number;
    categoryName: string;
    exercises: Exercise[];
}

interface Exercise {
    nthDay: number;
    nthCategory: number;
    nthExercise: number;
    exerciseId: string;
}

const ManualCreation = () => {
    const [days, setDays] = useState<Day[]>([]);
    const [showDeleteButtons, setShowDeleteButtons] = useState<boolean>(false);

    const [selectedNthDay, setSelectedNthDay] = useState<number | null>(null);
    const [selectedNthCategory, setSelectedNthCategory] = useState<number | null>(null);

    const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
    const [exerciseAnchorEl, setExerciseAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const storedDays = sessionStorage.getItem("categories");
        if (storedDays) {
            setDays(JSON.parse(storedDays));
        }
    }, []);

    const addDay = () => {
        const newDay: Day = {
            nthDay: days.length > 0 ? days[days.length - 1].nthDay + 1 : 1,
            categories: [],
        };
        setDays([...days, newDay]);
    };

    const removeDay = (dayId: number) => {
        const newDays = days
            .filter((day) => day.nthDay !== dayId)
            .map((day) => {
                if (day.nthDay > dayId) {
                    return {
                        ...day,
                        nthDay: day.nthDay - 1,
                        categories: day.categories.map((category) => ({
                            ...category,
                            nthDay: day.nthDay - 1,
                            exercises: category.exercises.map((exercise) => ({
                                ...exercise,
                                nthDay: day.nthDay - 1,
                            })),
                        })),
                    };
                }
                return day;
            });

        setDays(newDays);
    };

    const handleAddCategoryClick = (event: React.MouseEvent<HTMLElement>, dayId: number) => {
        setCategoryAnchorEl(event.currentTarget);
        setSelectedNthDay(dayId);
    };

    const handleAddExerciseClick = (event: React.MouseEvent<HTMLElement>, dayId: number, categoryId: number) => {
        setExerciseAnchorEl(event.currentTarget);
        setSelectedNthDay(dayId);
        setSelectedNthCategory(categoryId);
    };

    const handleClose = () => {
        setCategoryAnchorEl(null);
        setExerciseAnchorEl(null);
        setSelectedNthDay(null);
        setSelectedNthCategory(null);
    };

    const addCategoryToDay = (categoryName: string) => {
        if (selectedNthDay !== null) {
            setDays((prevDays) =>
                prevDays.map((day) =>
                    day.nthDay === selectedNthDay
                        ? {
                              ...day,
                              categories: [...day.categories, { nthDay: selectedNthDay, nthCategory: day.categories.length + 1, categoryName: categoryName, exercises: [] }],
                          }
                        : day
                )
            );
        }
        handleClose();
    };

    const addExerciseToCategory = (exerciseName: string) => {
        if (selectedNthDay !== null && selectedNthCategory !== null) {
            setDays((prevDays) => {
                const updatedDays = prevDays.map((day) => {
                    if (day.nthDay === selectedNthDay) {
                        const updatedCategories = day.categories.map((category) => {
                            if (category.nthCategory === selectedNthCategory) {
                                const updatedExercises = [...category.exercises, { nthDay: selectedNthDay, nthCategory: selectedNthCategory, nthExercise: category.exercises.length + 1, exerciseId: exerciseName }];
                                return { ...category, exercises: updatedExercises };
                            }
                            return category;
                        });
                        return { ...day, categories: updatedCategories };
                    }
                    return day;
                });
                return updatedDays;
            });
            handleClose();
        }
    };

    const removeExercise = (dayId: number, categoryId: number, exerciseId: number) => {
        setDays((prevDays) => {
            const updatedDays = prevDays.map((day) => {
                if (day.nthDay === dayId) {
                    const updatedCategories = day.categories.map((category) => {
                        if (category.nthCategory === categoryId) {
                            const updatedExercises = category.exercises
                                .filter((exercise) => exercise.nthExercise !== exerciseId)
                                .map((exercise) => {
                                    if (exercise.nthExercise > exerciseId) {
                                        return {
                                            ...exercise,
                                            nthExercise: exercise.nthExercise - 1,
                                        };
                                    }
                                    return exercise;
                                });
                            return { ...category, exercises: updatedExercises };
                        }
                        return category;
                    });
                    return { ...day, categories: updatedCategories };
                }
                return day;
            });
            return updatedDays;
        });
    };

    const removeCategory = (dayId: number, categoryId: number) => {
        setDays((prevDays) => {
            const updatedDays = prevDays.map((day) => {
                if (day.nthDay === dayId) {
                    const updatedCategories = day.categories
                        .filter((category) => category.nthCategory !== categoryId)
                        .map((category) => {
                            if (category.nthCategory > categoryId) {
                                return {
                                    ...category,
                                    nthCategory: category.nthCategory - 1,
                                    exercises: category.exercises.map((exercise) => ({
                                        ...exercise,
                                        nthCategory: category.nthCategory - 1,
                                    })),
                                };
                            }
                            return category;
                        });
                    return { ...day, categories: updatedCategories };
                }
                return day;
            });
            return updatedDays;
        });
    };

    const moveExerciseUp = (dayId: number, categoryId: number, exerciseId: number) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
            const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);
            const exerciseIndex = updatedDays[dayIndex].categories[categoryIndex].exercises.findIndex((exercise) => exercise.nthExercise === exerciseId);

            if (exerciseIndex === 0) {
                // Hledáme předchozí kategorii se stejným názvem (v libovolném dni)
                let targetDayIndex = -1;
                let targetCategoryIndex = -1;

                // Prohledáme všechny dny a kategorie
                for (let i = dayIndex; i >= 0; i--) {
                    for (let j = i === dayIndex ? categoryIndex - 1 : updatedDays[i].categories.length - 1; j >= 0; j--) {
                        if (updatedDays[i].categories[j].categoryName === updatedDays[dayIndex].categories[categoryIndex].categoryName) {
                            targetDayIndex = i;
                            targetCategoryIndex = j;
                            break;
                        }
                    }
                    if (targetDayIndex !== -1) break;
                }

                // Pokud jsme našli cílovou kategorii
                if (targetDayIndex !== -1 && targetCategoryIndex !== -1) {
                    // Přesun cviku do cílové kategorie (na konec)
                    const exerciseToMove = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
                    updatedDays[dayIndex].categories[categoryIndex].exercises.splice(exerciseIndex, 1); // Odstranění cviku z aktuální kategorie

                    // Aktualizace nthDay, nthCategory a nthExercise pro přesunutý cvik
                    const targetCategory = updatedDays[targetDayIndex].categories[targetCategoryIndex];
                    exerciseToMove.nthDay = targetCategory.nthDay;
                    exerciseToMove.nthCategory = targetCategory.nthCategory;
                    exerciseToMove.nthExercise = targetCategory.exercises.length + 1;

                    // Přidání cviku do cílové kategorie
                    targetCategory.exercises.push(exerciseToMove);

                    // Aktualizace nthExercise v původní kategorii
                    updatedDays[dayIndex].categories[categoryIndex].exercises = updatedDays[dayIndex].categories[categoryIndex].exercises.map((exercise, index) => ({
                        ...exercise,
                        nthExercise: index + 1,
                    }));
                }
            } else if (exerciseIndex > 0) {
                // Přesun cviku nahoru v rámci kategorie
                const temp = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex - 1];
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex - 1] = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex] = temp;

                // Aktualizace nthExercise pro oba cviky
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex - 1].nthExercise = exerciseIndex;
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex].nthExercise = exerciseIndex + 1;
            }

            return updatedDays;
        });
    };

    const moveExerciseDown = (dayId: number, categoryId: number, exerciseId: number) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
            const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);
            const exerciseIndex = updatedDays[dayIndex].categories[categoryIndex].exercises.findIndex((exercise) => exercise.nthExercise === exerciseId);

            if (exerciseIndex === updatedDays[dayIndex].categories[categoryIndex].exercises.length - 1) {
                // Hledáme další kategorii se stejným názvem (v libovolném dni)
                let targetDayIndex = -1;
                let targetCategoryIndex = -1;

                // Prohledáme všechny dny a kategorie
                for (let i = dayIndex; i < updatedDays.length; i++) {
                    for (let j = i === dayIndex ? categoryIndex + 1 : 0; j < updatedDays[i].categories.length; j++) {
                        if (updatedDays[i].categories[j].categoryName === updatedDays[dayIndex].categories[categoryIndex].categoryName) {
                            targetDayIndex = i;
                            targetCategoryIndex = j;
                            break;
                        }
                    }
                    if (targetDayIndex !== -1) break;
                }

                // Pokud jsme našli cílovou kategorii
                if (targetDayIndex !== -1 && targetCategoryIndex !== -1) {
                    // Přesun cviku do cílové kategorie (na začátek)
                    const exerciseToMove = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
                    updatedDays[dayIndex].categories[categoryIndex].exercises.splice(exerciseIndex, 1); // Odstranění cviku z aktuální kategorie

                    // Aktualizace nthDay, nthCategory a nthExercise pro přesunutý cvik
                    const targetCategory = updatedDays[targetDayIndex].categories[targetCategoryIndex];
                    exerciseToMove.nthDay = targetCategory.nthDay;
                    exerciseToMove.nthCategory = targetCategory.nthCategory;
                    exerciseToMove.nthExercise = 1; // Přidáme na začátek, takže nthExercise = 1

                    // Přidání cviku do cílové kategorie
                    targetCategory.exercises.unshift(exerciseToMove);

                    // Aktualizace nthExercise v cílové kategorii
                    targetCategory.exercises = targetCategory.exercises.map((exercise, index) => ({
                        ...exercise,
                        nthExercise: index + 1,
                    }));
                }
            } else if (exerciseIndex < updatedDays[dayIndex].categories[categoryIndex].exercises.length - 1) {
                // Přesun cviku dolů v rámci kategorie
                const temp = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex + 1];
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex + 1] = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex] = temp;

                // Aktualizace nthExercise pro oba cviky
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex].nthExercise = exerciseIndex + 1;
                updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex + 1].nthExercise = exerciseIndex + 2;
            }

            return updatedDays;
        });
    };

    const moveCategoryUp = (dayId: number, categoryId: number) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
            const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);

            if (categoryIndex === 0 && dayIndex > 0) {
                // Přesun kategorie do předchozího dne (na konec)
                const categoryToMove = updatedDays[dayIndex].categories[categoryIndex];
                updatedDays[dayIndex].categories.splice(categoryIndex, 1); // Odstranění kategorie z aktuálního dne
                updatedDays[dayIndex - 1].categories.push({
                    ...categoryToMove,
                    nthDay: updatedDays[dayIndex - 1].nthDay,
                    nthCategory: updatedDays[dayIndex - 1].categories.length + 1,
                    exercises: categoryToMove.exercises.map((exercise) => ({
                        ...exercise,
                        nthDay: updatedDays[dayIndex - 1].nthDay,
                        nthCategory: updatedDays[dayIndex - 1].categories.length + 1,
                    })),
                });

                // Aktualizace nthCategory v původním dni
                updatedDays[dayIndex].categories = updatedDays[dayIndex].categories.map((category, index) => ({
                    ...category,
                    nthCategory: index + 1,
                    exercises: category.exercises.map((exercise) => ({
                        ...exercise,
                        nthCategory: index + 1,
                    })),
                }));
            } else if (categoryIndex > 0) {
                // Přesun kategorie nahoru v rámci dne
                const temp = updatedDays[dayIndex].categories[categoryIndex - 1];
                updatedDays[dayIndex].categories[categoryIndex - 1] = updatedDays[dayIndex].categories[categoryIndex];
                updatedDays[dayIndex].categories[categoryIndex] = temp;

                // Aktualizace nthCategory pro obě kategorie
                updatedDays[dayIndex].categories[categoryIndex - 1].nthCategory = categoryIndex;
                updatedDays[dayIndex].categories[categoryIndex].nthCategory = categoryIndex + 1;

                // Aktualizace nthCategory pro cviky v obou kategoriích
                updatedDays[dayIndex].categories[categoryIndex - 1].exercises = updatedDays[dayIndex].categories[categoryIndex - 1].exercises.map((exercise) => ({
                    ...exercise,
                    nthCategory: categoryIndex,
                }));
                updatedDays[dayIndex].categories[categoryIndex].exercises = updatedDays[dayIndex].categories[categoryIndex].exercises.map((exercise) => ({
                    ...exercise,
                    nthCategory: categoryIndex + 1,
                }));
            }

            return updatedDays;
        });
    };

    const moveCategoryDown = (dayId: number, categoryId: number) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
            const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);

            if (categoryIndex === updatedDays[dayIndex].categories.length - 1 && dayIndex < updatedDays.length - 1) {
                // Přesun kategorie do dalšího dne (na začátek)
                const categoryToMove = updatedDays[dayIndex].categories[categoryIndex];
                updatedDays[dayIndex].categories.splice(categoryIndex, 1); // Odstranění kategorie z aktuálního dne
                updatedDays[dayIndex + 1].categories.unshift({
                    ...categoryToMove,
                    nthDay: updatedDays[dayIndex + 1].nthDay,
                    nthCategory: 1,
                    exercises: categoryToMove.exercises.map((exercise) => ({
                        ...exercise,
                        nthDay: updatedDays[dayIndex + 1].nthDay,
                        nthCategory: 1,
                    })),
                });

                // Aktualizace nthCategory v cílovém dni
                updatedDays[dayIndex + 1].categories = updatedDays[dayIndex + 1].categories.map((category, index) => ({
                    ...category,
                    nthCategory: index + 1,
                    exercises: category.exercises.map((exercise) => ({
                        ...exercise,
                        nthCategory: index + 1,
                    })),
                }));
            } else if (categoryIndex < updatedDays[dayIndex].categories.length - 1) {
                // Přesun kategorie dolů v rámci dne
                const temp = updatedDays[dayIndex].categories[categoryIndex + 1];
                updatedDays[dayIndex].categories[categoryIndex + 1] = updatedDays[dayIndex].categories[categoryIndex];
                updatedDays[dayIndex].categories[categoryIndex] = temp;

                // Aktualizace nthCategory pro obě kategorie
                updatedDays[dayIndex].categories[categoryIndex].nthCategory = categoryIndex + 1;
                updatedDays[dayIndex].categories[categoryIndex + 1].nthCategory = categoryIndex + 2;

                // Aktualizace nthCategory pro cviky v obou kategoriích
                updatedDays[dayIndex].categories[categoryIndex].exercises = updatedDays[dayIndex].categories[categoryIndex].exercises.map((exercise) => ({
                    ...exercise,
                    nthCategory: categoryIndex + 1,
                }));
                updatedDays[dayIndex].categories[categoryIndex + 1].exercises = updatedDays[dayIndex].categories[categoryIndex + 1].exercises.map((exercise) => ({
                    ...exercise,
                    nthCategory: categoryIndex + 2,
                }));
            }

            return updatedDays;
        });
    };

    const moveDayUp = (dayId: number) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const index = updatedDays.findIndex((day) => day.nthDay === dayId);

            if (index > 0) {
                // Prohodíme den s předchozím dnem
                [updatedDays[index - 1], updatedDays[index]] = [updatedDays[index], updatedDays[index - 1]];

                // Aktualizujeme nthDay pro oba dny
                updatedDays[index - 1].nthDay = index;
                updatedDays[index].nthDay = index + 1;

                // Aktualizujeme nthDay pro kategorie a cviky v obou dnech
                updatedDays[index - 1].categories = updatedDays[index - 1].categories.map((category) => ({
                    ...category,
                    nthDay: index,
                    exercises: category.exercises.map((exercise) => ({
                        ...exercise,
                        nthDay: index,
                    })),
                }));
                updatedDays[index].categories = updatedDays[index].categories.map((category) => ({
                    ...category,
                    nthDay: index + 1,
                    exercises: category.exercises.map((exercise) => ({
                        ...exercise,
                        nthDay: index + 1,
                    })),
                }));
            }

            return updatedDays;
        });
    };

    const moveDayDown = (dayId: number) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const index = updatedDays.findIndex((day) => day.nthDay === dayId);

            if (index < updatedDays.length - 1) {
                // Prohodíme den s následujícím dnem
                [updatedDays[index], updatedDays[index + 1]] = [updatedDays[index + 1], updatedDays[index]];

                // Aktualizujeme nthDay pro oba dny
                updatedDays[index].nthDay = index + 1;
                updatedDays[index + 1].nthDay = index + 2;

                // Aktualizujeme nthDay pro kategorie a cviky v obou dnech
                updatedDays[index].categories = updatedDays[index].categories.map((category) => ({
                    ...category,
                    nthDay: index + 1,
                    exercises: category.exercises.map((exercise) => ({
                        ...exercise,
                        nthDay: index + 1,
                    })),
                }));
                updatedDays[index + 1].categories = updatedDays[index + 1].categories.map((category) => ({
                    ...category,
                    nthDay: index + 2,
                    exercises: category.exercises.map((exercise) => ({
                        ...exercise,
                        nthDay: index + 2,
                    })),
                }));
            }

            return updatedDays;
        });
    };

    const extractExercises = () => {
        console.log("Aktuální dny:", days);
        const allExercises = days.flatMap((day) => day.categories.flatMap((category) => category.exercises));
        console.log("Extrahovaná cvičení:", allExercises);
        return allExercises;
    };

    const handleSaveTrainingPlan = () => {
        const extractedExercises = extractExercises();

        if (extractedExercises === undefined || extractedExercises.length === 0) {
            console.error("Žádná cvičení nejsou k dispozici pro odeslání.");
        } else {
            console.log("Odesílám cvičení:", JSON.stringify(extractedExercises));
        }
    };

    return (
        <>
            <Head>
                <title>Tvorba tréninku - KlikFit</title>
            </Head>

            <Layout>
                <SingleColumnPage>
                    <Box className="flex h-full p-0 m-0">
                        <GeneralCard
                            width="w-2/3"
                            height="h-full"
                            title="Tvorba tréninku"
                            border
                        >
                            <Box className="space-y-4">
                                <Box className="flex justify-between items-center">
                                    <Typography variant="h4">Tvorba tréninku</Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setShowDeleteButtons(!showDeleteButtons)}
                                    >
                                        {showDeleteButtons ? "Skrýt mazání" : "Zobrazit mazání"}
                                    </Button>
                                </Box>

                                {days.map((day, index) => (
                                    <Box
                                        key={day.nthDay}
                                        className="flex flex-col"
                                    >
                                        <Box className="flex items-center gap-1">
                                            {showDeleteButtons && (
                                                <Button
                                                    className="w-auto h-auto p-1 min-w-8"
                                                    onClick={() => removeDay(day.nthDay)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    x
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => moveDayUp(day.nthDay)}
                                                size="small"
                                                className="w-auto h-auto p-1 min-w-8"
                                            >
                                                <ArrowUpward fontSize="small" />
                                            </Button>
                                            <Button
                                                onClick={() => moveDayDown(day.nthDay)}
                                                size="small"
                                                className="w-auto h-auto p-1 min-w-8"
                                            >
                                                <ArrowDownward fontSize="small" />
                                            </Button>
                                            <Typography className="text-xl"> {`Tréninkový den ${index + 1}`} </Typography>
                                        </Box>

                                        <Box className="flex flex-col flex-wrap gap-2">
                                            {day.categories.map((category) => (
                                                <Box
                                                    key={category.nthCategory}
                                                    className="px-2 py-1 rounded flex flex-col"
                                                >
                                                    <Box className="flex items-center">
                                                        {showDeleteButtons && (
                                                            <Button
                                                                onClick={() => removeCategory(day.nthDay, category.nthCategory)}
                                                                color="error"
                                                                size="small"
                                                                className="w-auto h-auto p-1 min-w-8"
                                                            >
                                                                x
                                                            </Button>
                                                        )}
                                                        <Box className="flex items-center gap-1">
                                                            <Button
                                                                onClick={() => moveCategoryUp(day.nthDay, category.nthCategory)}
                                                                size="small"
                                                                className="w-auto h-auto p-1 min-w-8"
                                                            >
                                                                <ArrowUpward fontSize="small" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => moveCategoryDown(day.nthDay, category.nthCategory)}
                                                                size="small"
                                                                className="w-auto h-auto p-1 min-w-8"
                                                            >
                                                                <ArrowDownward fontSize="small" />
                                                            </Button>
                                                        </Box>
                                                        <Title
                                                            smallPaddingTop
                                                            title={category.categoryName}
                                                        />
                                                    </Box>

                                                    {category.exercises.map((exercise) => (
                                                        <Box
                                                            key={exercise.nthExercise}
                                                            className={`px-2 py-2 font-light rounded-xl ${exercise.nthExercise % 2 !== 0 ? "bg-gray-50" : ""} flex items-center`}
                                                        >
                                                            {showDeleteButtons && (
                                                                <Button
                                                                    onClick={() => removeExercise(day.nthDay, category.nthCategory, exercise.nthExercise)}
                                                                    color="error"
                                                                    size="small"
                                                                    className="w-auto h-auto p-1 min-w-8"
                                                                >
                                                                    x
                                                                </Button>
                                                            )}
                                                            <Typography className="font-light">{exercise.exerciseId}</Typography>
                                                            <Box className="ml-auto">
                                                                <Button
                                                                    onClick={() => moveExerciseUp(day.nthDay, category.nthCategory, exercise.nthExercise)}
                                                                    size="small"
                                                                    className="w-auto h-auto p-1 min-w-8"
                                                                >
                                                                    <ArrowUpward fontSize="small" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => moveExerciseDown(day.nthDay, category.nthCategory, exercise.nthExercise)}
                                                                    size="small"
                                                                    className="w-auto h-auto p-1 min-w-8"
                                                                >
                                                                    <ArrowDownward fontSize="small" />
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    ))}

                                                    <Button
                                                        variant="outlined"
                                                        onClick={(event) => handleAddExerciseClick(event, day.nthDay, category.nthCategory)}
                                                        className="mt-2 w-fit"
                                                    >
                                                        Přidat cvik
                                                    </Button>
                                                </Box>
                                            ))}

                                            <Button
                                                className="w-fit"
                                                variant="outlined"
                                                onClick={(event) => handleAddCategoryClick(event, day.nthDay)}
                                            >
                                                Přidat kategorii
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={addDay}
                                    className="mt-4"
                                >
                                    Přidat den
                                </Button>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveTrainingPlan}
                                className="mt-4"
                            >
                                Uložit tréninkový plán
                            </Button>

                            <Menu
                                anchorEl={categoryAnchorEl}
                                open={Boolean(categoryAnchorEl)}
                                onClose={handleClose}
                            >
                                {options.map((option) => (
                                    <MenuItem
                                        key={option}
                                        onClick={() => addCategoryToDay(option)}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>

                            <Menu
                                anchorEl={exerciseAnchorEl}
                                open={Boolean(exerciseAnchorEl)}
                                onClose={handleClose}
                            >
                                {exerciseOptions.map((exercise) => (
                                    <MenuItem
                                        key={exercise}
                                        onClick={() => addExerciseToCategory(exercise)}
                                    >
                                        {exercise}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </GeneralCard>

                        <GeneralCard
                            width="w-1/3"
                            height="h-full"
                            title="Doporučené hodnoty"
                        >
                            <></>
                        </GeneralCard>
                    </Box>
                </SingleColumnPage>
            </Layout>
        </>
    );
};

export default ManualCreation;
