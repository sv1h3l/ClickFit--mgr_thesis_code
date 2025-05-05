import { TrainingPlan } from "@/components/large/TrainingPlansAndCreation";
import { TrainingPlanExercise } from "@/pages/training-plan";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ThemeColor = "gray" | "red" | "green" | "blue";
export type TextSize = "text_size-small" | "text_size-medium" | "text_size-large";

interface AppContextInterface {
	outerContentColor: string;

	bgPrimaryColor: string;
	bgSecondaryColor: string;
	bgTertiaryColor: string;
	bgQuaternaryColor: string;

	borderPrimaryColor: string;
	borderSecondaryColor: string;
	borderTertiaryColor: string;
	borderQuaternaryColor: string;

	bgHoverTertiaryColor: string;
	borderHoverTertiaryColor: string;

	logoColor: string;

	setColors: (color: ThemeColor) => void;

	textSize: TextSize;
	setTextSize: (size: TextSize) => void;

	trainingPlan: TrainingPlan | undefined;
	setTrainingPlan: (trainingPlan: TrainingPlan | undefined) => void;

	trainingPlanExercises: TrainingPlanExercise[];
	setTrainingPlanExercises: (exercises: TrainingPlanExercise[]) => void;
}

const defaultColors = {
	outerContentColor: " outer_content-color-gray ",

	bgPrimaryColor: " bg-primary_color-gray ",
	bgSecondaryColor: " bg-secondary_color-gray ",
	bgTertiaryColor: " bg-tertiary_color-gray ",
	bgQuaternaryColor: " bg-quaternary_color-gray ",

	borderPrimaryColor: " border-primary_color-gray ",
	borderSecondaryColor: " border-secondary_color-gray ",
	borderTertiaryColor: " border-tertiary_color-gray ",
	borderQuaternaryColor: " border-quaternary_color-gray ",

	bgHoverTertiaryColor: " bg_hover-tertiary_color-gray ",
	borderHoverTertiaryColor: " border_hover-tertiary_color-gray ",

	logoColor: "/icons/logo-gray.webp",
};

const AppContext = createContext<AppContextInterface>({
	...defaultColors,
	textSize: "text_size-medium",
	setColors: () => {},
	setTextSize: () => {},

	trainingPlan: undefined,
	setTrainingPlan: () => {},

	trainingPlanExercises: [],
	setTrainingPlanExercises: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	// #region Settings
	const [colors, setColors] = useState(defaultColors);

	const setColor = (color: ThemeColor) => {
		const newColors = {
			outerContentColor: "outer_content-color-" + color,

			bgPrimaryColor: " bg-primary_color-" + color + " ",
			bgSecondaryColor: " bg-secondary_color-" + color + " ",
			bgTertiaryColor: " bg-tertiary_color-" + color + " ",
			bgQuaternaryColor: " bg-quaternary_color-" + color + " ",

			borderPrimaryColor: " border-primary_color-" + color + " ",
			borderSecondaryColor: " border-secondary_color-" + color + " ",
			borderTertiaryColor: " border-tertiary_color-" + color + " ",
			borderQuaternaryColor: " border-quaternary_color-" + color + " ",

			bgHoverTertiaryColor: " bg_hover-tertiary_color-" + color + " ",
			borderHoverTertiaryColor: " border_hover-tertiary_color-" + color + " ",

			logoColor: "/icons/logo-" + color + ".webp",
		};

		setColors(newColors);
	};

	const [textSize, setTextSize] = useState<TextSize>("text_size-medium");

	useEffect(() => {
		if (textSize) {
			document.documentElement.className = textSize;
		}
	}, [textSize]);

	// #endregion

	// #region Training Plan
	const [trainingPlanExercises, setTrainingPlanExercises] = useState<TrainingPlanExercise[]>([]);
	const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | undefined>();

	// #endregion

	return <AppContext.Provider value={{ ...colors, textSize, setColors: setColor, setTextSize, trainingPlanExercises, setTrainingPlanExercises, trainingPlan, setTrainingPlan }}>{children}</AppContext.Provider>;
};
