import { getAllUserAtrsReq } from "@/api/get/getAllUserAtrsReq";
import CategoryInformations from "@/components/large/CategoryInformations";
import ExerciseInformation, { ExerciseInformationLabel } from "@/components/large/ExerciseInformations";
import SportDescriptionAndSettings, { SportDifficulty } from "@/components/large/SportDescriptionAndSettings";
import SportsAndExercises, { isExercise, isSport } from "@/components/large/SportsAndExercises";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { useAppContext } from "@/utilities/Context";
import { Box } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Category } from "../api/get/getCategoriesWithExercisesReq";
import { Exercise } from "../api/get/getExercisesReq";
import { Sport, getSportsReq } from "../api/get/getSportsReq";

const cookie = require("cookie");

//import * as cookie from "cookie";

const SportsPage = ({ initialSportsData, userId }: { initialSportsData: Sport[]; userId: number }) => {
	const context = useAppContext();

	const [sportsData, setSportsData] = useState<Sport[]>(initialSportsData ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [selectedSportOrExercise, setSelectedSportOrExercise] = useState<Sport | Exercise | null>(null);

	const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
	const [categoriesData, setCategoriesData] = useState<Category[]>([]);
	const [sportDifficultiesData, setSportDifficultiesData] = useState<SportDifficulty[]>([]);

	const [exerciseInformationLabelsData, setExerciseInformationLabelsData] = useState<ExerciseInformationLabel[]>([]);

	const [editing, setEditing] = useState<boolean>(false);

	const [isActiveFirstChildren, setIsActiveFirstChildren] = useState<boolean>(true);
	const [showFirstSection, setShowFirstSection] = useState<boolean>(true);

	const [isFirstSectionVisible, setIsFirstSectionVisible] = useState(true);
	const [firstSectionHasFullWidth, setFirstSectionHasFullWidth] = useState(true);
	const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);

	useEffect(() => {
		if (context.activeSection === 1) {
			setIsSecondSectionVisible(false);
			setTimeout(() => setFirstSectionHasFullWidth(true), 200);
			setTimeout(() => setIsFirstSectionVisible(true), 250);
		} else {
			setIsFirstSectionVisible(false);
			setTimeout(() => setFirstSectionHasFullWidth(false), 200);
			setTimeout(() => setIsSecondSectionVisible(true), 250);
		}
	}, [context.activeSection]);

	return (
		<>
			<Head>
				<title>Databáze cviků - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth={context.isSmallDevice ? (firstSectionHasFullWidth ? "w-full" : "w-0") : "w-9/24"}
				secondColumnWidth={context.isSmallDevice ? (!firstSectionHasFullWidth ? "w-full" : "w-0") : "w-15/24"}
				firstColumnChildren={
					!context.isSmallDevice || firstSectionHasFullWidth ? (
						<Box
							className={`transition-all duration-200 h-full
										${isFirstSectionVisible || !context.isSmallDevice ? "opacity-100" : "opacity-0"}`}>
							<SportsAndExercises
								props={{
									userId: userId,
									exercisesDatabase: true,
									sportsData: {
										state: sportsData,
										setState: setSportsData,
									},

									selectedSport: {
										state: selectedSport,
										setState: setSelectedSport,
									},
									selectedCategory: {
										state: selectedCategory,
										setState: setSelectedCategory,
									},
									selectedSportOrExercise: {
										state: selectedSportOrExercise,
										setState: setSelectedSportOrExercise,
									},

									exercisesData: {
										state: exercisesData,
										setState: setExercisesData,
									},
									categoriesData: {
										state: categoriesData,
										setState: setCategoriesData,
									},
									sportDifficultiesData: {
										state: sportDifficultiesData,
										setState: setSportDifficultiesData,
									},

									exerciseInformationLabelsData: {
										state: exerciseInformationLabelsData,
										setState: setExerciseInformationLabelsData,
									},

									editing: {
										state: editing,
										setState: setEditing,
									},
									dontShow: true,
									showFirstSection: {
										state: showFirstSection,
										setState: setShowFirstSection,
									},
								}}
							/>
						</Box>
					) : (
						<></>
					)
				}
				secondColumnChildren={
					!context.isSmallDevice || !firstSectionHasFullWidth ? (
						<Box
							className={`transition-all duration-200 h-full
							${isSecondSectionVisible || !context.isSmallDevice ? "opacity-100" : "opacity-0"}`}>
							{selectedCategory !== null ? (
								<CategoryInformations
									categoriesData={{
										state: categoriesData,
										setState: setCategoriesData,
									}}
									selectedCategory={{ state: selectedCategory, setState: setSelectedCategory }}
									selectedSport={{
										state: selectedSport,
										setState: setSelectedSport,
									}}
									editing={{
										state: editing,
										setState: setEditing,
									}}
									isActiveFirstChildren={{
										state: isActiveFirstChildren,
										setState: setIsActiveFirstChildren,
									}}
								/>
							) : isSport(selectedSportOrExercise) ? (
								<SportDescriptionAndSettings
									sportsData={{
										state: sportsData,
										setState: setSportsData,
									}}
									sportDifficultiesData={{
										state: sportDifficultiesData,
										setState: setSportDifficultiesData,
									}}
									selectedSport={{
										state: selectedSport,
										setState: setSelectedSport,
									}}
									selectedSportOrExercise={{
										state: selectedSportOrExercise,
										setState: setSelectedSportOrExercise,
									}}
									exercisesData={{
										state: exercisesData,
										setState: setExercisesData,
									}}
									categoriesData={{
										state: categoriesData,
										setState: setCategoriesData,
									}}
									editing={{
										state: editing,
										setState: setEditing,
									}}
									isActiveFirstChildren={{
										state: isActiveFirstChildren,
										setState: setIsActiveFirstChildren,
									}}
									showFirstSection={{
										state: showFirstSection,
										setState: setShowFirstSection,
									}}
									sportName={selectedSport?.sportName || ""}
								/>
							) : isExercise(selectedSportOrExercise) ? (
								<ExerciseInformation
									props={{
										exerciseCategory: selectedSport?.hasCategories ? categoriesData.find((category) => category.categoryId === selectedSportOrExercise.categoryId)?.categoryName || "" : "",
										exerciseName: selectedSportOrExercise.exerciseName,
										exerciseDescription: selectedSportOrExercise.description,
										exerciseYoutubeLink: selectedSportOrExercise.youtubeLink,

										selectedSport: {
											state: selectedSport,
											setState: setSelectedSport,
										},

										selectedExercise: {
											state: selectedSportOrExercise,
											setState: setSelectedSportOrExercise,
										},

										sportDifficultiesData: {
											state: sportDifficultiesData,
											setState: setSportDifficultiesData,
										},

										exerciseOrderNumberWithoutCategories: selectedSportOrExercise.orderNumberWithoutCategories,
										exerciseOrderNumber: selectedSportOrExercise.orderNumber,
										sportId: selectedSport?.sportId || -1,
										difficultyId: selectedSport?.hasDifficulties ? selectedSportOrExercise.sportDifficultyId : -1,
										categoryId: selectedSport?.hasCategories ? selectedSportOrExercise.categoryId : -1,
										exerciseId: selectedSportOrExercise.exerciseId,

										exercisesData: {
											state: exercisesData,
											setState: setExercisesData,
										},
										categoriesData: {
											state: categoriesData,
											setState: setCategoriesData,
										},

										exerciseInformationLabelsData: {
											state: exerciseInformationLabelsData,
											setState: setExerciseInformationLabelsData,
										},

										editing: {
											state: editing,
											setState: setEditing,
										},

										isActiveFirstChildren: {
											state: isActiveFirstChildren,
											setState: setIsActiveFirstChildren,
										},
									}}
								/>
							) : null}
						</Box>
					) : (
						<></>
					)
				}
			/>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		const response = await getSportsReq({ authToken });

		const user = await getAllUserAtrsReq({ authToken });

		if (response.status === 200) {
			return {
				props: {
					initialSportsData: response.data || [],
					userId: user.data?.userId || -1,
				},
			};
		} else {
			console.error("Error fetching sports data:", response.message);
			return {
				props: {
					initialSportsData: [],
					userId: -1,
				},
			};
		}
	} catch (error) {
		console.error("Error fetching sports data:", error);
		return {
			props: {
				initialSportsData: [],
				userId: -1,
			},
		};
	}
};

export default SportsPage;
