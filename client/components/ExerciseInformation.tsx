import { Box, Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";
import LabelAndValue from "./LabelAndValue";

interface ExerciseInformationProps {
	exerciseDescription: string;
	exerciseYoutubeLink: string;
}

function ExerciseInformation({ props }: { props: ExerciseInformationProps }) {
	return (
		<>
			<GeneralCard
				firstTitle="Podrobnosti"
				secondTitle="Provedení"
				height="h-full"
				firstChildren={
					<Box className="flex flex-col  ">
						<LabelAndValue
							noPaddingTop
							label="Název cviku"
							value="Přitahovaní olympijské osy v předklonu"
						/>
						<LabelAndValue
							label="Náročnost"
							value="střední"
						/>

						<LabelAndValue
							label="Typ cviku"
							value="komplexní"
						/>

						<LabelAndValue
							label="Primární zaměření"
							value="široký sval zádový"
						/>

						<LabelAndValue
							label="Sekundární zaměření"
							value="břicho, nohy, dvojhlavý sval pažní, předloktí "
						/>

						<LabelAndValue
							label="Doporučená váha"
							value="20 - 40 kg"
						/>

						<LabelAndValue
							label="Doporučený počet opakování"
							value="8 - 10"
						/>

						<LabelAndValue
							label="Doporučený počet sérií"
							value="3"
						/>

						<LabelAndValue
							label="Nutné vybavení"
							value="olympijská osa, závaží"
						/>

						<LabelAndValue
							label="Doporučené vybavení"
							value="brzdy na olympijskou osu"
						/>

						<LabelAndValue
							label="Nutná asistence"
							value="ne"
						/>

						<LabelAndValue
							label="Cvik je cílený na"
							value="sílu, hypertrofii"
						/>

						{/*{props.exercisesDatabase && (
						<Box className="mt-2">
							<TextFieldWithPlus
								placeHolder="Název nového sportu"
								onClick={handleCreateSport}
							/>
						</Box>
					)}*/}
					</Box>
				}
				secondChildren={
					<Box className="h-full">
						<Box className="pt-6 pb-12 ">
							<Typography className=" font-light ">
								{props.exerciseDescription}
							</Typography>
						</Box>

						<Box className=" ">
							<Box className="   w-full flex justify-center ">
								<iframe
									className=" h-auto w-full aspect-video rounded-3xl"
									width="854"
									height="480"
									src={props.exerciseYoutubeLink+"?&mute=1&rel=0"}
									//src="https://www.youtube.com/embed/9Gf-Ourup_k?&mute=1&rel=0"
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
							</Box>
						</Box>
					</Box>
				}></GeneralCard>
		</>
	);
}

export default ExerciseInformation;
