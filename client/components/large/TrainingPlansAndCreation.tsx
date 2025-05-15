import { Sport } from "@/api/get/getSportsReq";
import { useAppContext } from "@/utilities/Context";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import router from "next/router";
import { useEffect } from "react";
import GeneralCard from "./GeneralCard";
import Sports from "./Sports";

export interface TrainingPlan {
	trainingPlanId: number;
	sportId: number;
	authorId: number;
	ownerId: number;

	name: string;
	sportName: string;
	authorName: string;
	orderNumber: number;
	dateOfCreation: string;

	hasBurdenAndUnit: boolean;
	unitCode: number;

	canOwnerEdt?: boolean;
}

interface Props {
	trainingPlans: TrainingPlan[];

	sportsData: StateAndSetFunction<Sport[]>;
	selectedSport: StateAndSetFunction<Sport | null>;

	showFirstSectionSignal: StateAndSetFunction<boolean>;
	showFirstSection: StateAndSetFunction<boolean>;

	clickedTrainingPlanId: StateAndSetFunction<number>;

	cannotEdit?: boolean;
}

const TrainingPlansAndCreation = (props: Props) => {
	const context = useAppContext();

	useEffect(() => {
		if (props.trainingPlans.length < 1) {
			props.showFirstSectionSignal.setState(false);
			props.showFirstSection.setState(false);
		}
	}, [props.trainingPlans]);

	return (
		<GeneralCard
			firstTitle="Tréninky"
			secondTitle={context.windowWidth > 375 ? "Nový trénink" : "Nový"}
			height="h-full"
			showBackButton={props.cannotEdit}
			backButtonClick={() => {
				router.push(`/chat`);
			}}
			showFirstSection={{
				state: props.showFirstSection.state,
				setState: props.showFirstSection.setState,
			}}
			showFirstSectionSignal={{ state: props.showFirstSectionSignal.state, setState: props.showFirstSectionSignal.setState }}
			firstChildren={
				<Box>
					{props.trainingPlans.length > 0 ? (
						<Box className="space-y-4">
							<Box className={` rounded-xl  overflow-hidden py-1.5 px-2.5 `}>
								<Box className="flex ">
									<Typography className="w-1/2 font-light  text-[0.9rem] italic select-none">Název tréninku</Typography>
									<Typography className="w-1/2 font-light  text-[0.9rem] italic select-none">Sport</Typography>
								</Box>
								<Box
									className="border-t-2 w-[105%] my-1 -ml-3"
									sx={{
										borderImage: "linear-gradient(to right,  #232323, #2d2d2d,  #2d2d2d, #232323) 1",
										borderImageSlice: 1,
									}}
								/>

								<Box className="flex">
									<Typography className="w-1/2 font-light  text-[0.9rem] italic select-none">Datum vytvoření</Typography>

									<Typography className="w-1/2 font-light  text-[0.9rem]  italic select-none">Autor</Typography>
								</Box>
							</Box>

							{props.trainingPlans.map((training) => (
								<Box
									key={training.trainingPlanId}
									onClick={() => {
										context.setActiveSection(2);
										props.clickedTrainingPlanId.setState(training.trainingPlanId);
									}}
									className={`group rounded-xl overflow-hidden transition-all duration-200 ease-in-out py-1.5 px-2.5 border-[0.125rem]
								${context.bgSecondaryColor} ${context.borderSecondaryColor} 
								${training.trainingPlanId === props.clickedTrainingPlanId.state && !context.isSmallDevice ? `   btn-message-shadow ${context.bgQuaternaryColor} ${context.borderQuaternaryColor}` : ` cursor-pointer ${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}`}

								
						`}>
									<Box className="flex items-center">
										<Typography
											className={`w-1/2 select-none
							  ${training.trainingPlanId !== props.clickedTrainingPlanId.state && "font-light tracking-[0.0185rem]"}`}>
											{training.name}
										</Typography>
										<Typography
											className={`w-1/2 select-none
							  ${training.trainingPlanId !== props.clickedTrainingPlanId.state && "font-light tracking-[0.0185rem]"}`}>
											{training.sportName}
										</Typography>
									</Box>

									<Box className="relative w-full h-[0.125rem] my-1 ">
										<Box
											className={`absolute inset-0 transition-opacity duration-200 ease-in-out bg-gradient-to-r from-transparent via-[#505050] to-transparent
												${training.trainingPlanId === props.clickedTrainingPlanId.state ? "opacity-100" : "opacity-0"} 
												`} // Add hover effect to change the middle color of the gradient
										/>
										<Box
											className={`absolute inset-0 transition-opacity duration-200 ease-in-out bg-gradient-to-r from-transparent via-[#2d2d2d] to-transparent
												${training.trainingPlanId === props.clickedTrainingPlanId.state ? "opacity-0" : "opacity-100"}
												f]`} // Add hover effect to change the middle color of the gradient
										/>
									</Box>

									<Box className="flex items-center">
										<Typography
											className={`w-1/2 select-none
							  					${training.trainingPlanId !== props.clickedTrainingPlanId.state && "font-light tracking-[0.0185rem]"}`}>
											{training.dateOfCreation}
										</Typography>
										<Typography
											className={`w-1/2 select-none
							  					${training.trainingPlanId !== props.clickedTrainingPlanId.state && "font-light tracking-[0.0185rem]"}`}>
											{training.authorName}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					) : (
						<Box>
							<Box className="flex">
								<Typography className="mt-3 text-lg font-light">
									Tréninkový plán vytvoříte v sekci <span className="font-normal">{context.windowWidth > 375 ? "Nový trénink" : "Nový"}</span>.
								</Typography>
							</Box>
						</Box>
					)}
				</Box>
			}
			secondChildren={
				<Sports
					selectedSport={{
						state: props.selectedSport.state,
						setState: props.selectedSport.setState,
					}}
					sportsData={{
						state: props.sportsData.state,
						setState: props.sportsData.setState,
					}}
				/>
			}
		/>
	);
};

export default TrainingPlansAndCreation;
