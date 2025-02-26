import { Box, Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";

type PersonalAndHealthDataProps = {
	email: string;
	firstName: string;
	lastName: string;
	height: string;
	weight: string;
	age: string;
	sex: string;
};

function PersonalAndHealthData({ email, firstName, lastName, height, weight, age, sex }: PersonalAndHealthDataProps) {
	return (
		<>
			<GeneralCard
				firstTitle="Osobní údaje"
				height="h-1/2"
				border
				firstChildren={
					<Box className="flex flex-col gap-8 w-full ">
						<Box className="flex w-1/2">
							<Typography className=" font-light">Email</Typography>
							<Typography className=" font-medium">{email}</Typography>
						</Box>

						<Box className="flex">
							<Box className="flex w-1/2">
								<Typography className=" font-light">Jméno</Typography>
								<Typography className=" font-medium">{firstName}</Typography>
							</Box>
							<Box className="flex w-1/2">
								<Typography className=" font-light">Příjmení</Typography>
								<Typography className=" font-medium">{lastName}</Typography>
							</Box>
						</Box>

						<Box className="flex">
							<Box className="flex w-1/2">
								<Typography className=" font-light">Výška</Typography>
								<Typography className=" font-medium">{height}</Typography>
							</Box>
							<Box className="flex w-1/2">
								<Typography className=" font-light">Váha</Typography>
								<Typography className=" font-medium">{weight}</Typography>
							</Box>
						</Box>

						<Box className="flex">
							<Box className="flex w-1/2">
								<Typography className=" font-light">Věk</Typography>
								<Typography className=" font-medium">{age}</Typography>
							</Box>
							<Box className="flex w-1/2">
								<Typography className=" font-light">Pohlaví</Typography>
								<Typography className=" font-medium">{sex}</Typography>
							</Box>
						</Box>

						<Box className="hidden">
							{/*TODO dodělat heslo */}
							<Box className="flex w-1/2">
								<Typography className=" font-light">Heslo</Typography>
								<Typography className=" font-medium">{firstName}</Typography>
							</Box>
							<Box className="flex w-1/2">
								<Typography className=" font-light">Potvrzení hesla</Typography>
								<Typography className=" font-medium">{lastName}</Typography>
							</Box>
						</Box>
					</Box>
				}
			/>

			<GeneralCard
				firstTitle="Zdravotní údaje"
				secondGeneralCard
				border
				height=" h-1/2"
				firstChildren={<Typography className="font-light  pl-3">Výrazná bolest kolen při cvičení, mírná bolest levého kotníku. Operace rotátorové manžety, plastika křížových vazů.</Typography>}
			/>
		</>
	);
}

export default PersonalAndHealthData;
