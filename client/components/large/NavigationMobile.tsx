import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";
import PersonIcon from "@mui/icons-material/Person";
import SportsMartialArtsRoundedIcon from "@mui/icons-material/SportsMartialArtsRounded";
import { Box, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

const cookie = require("cookie");

interface Props {
	externalClicked: StateAndSet<boolean>;
}

const NavigationMobile = (props: Props) => {
	const context = useAppContext();

	const router = useRouter();

	const pages = [
		{ path: "training-plans", label: "Tréninky", icon: SportsMartialArtsRoundedIcon },
		{ path: "training-plan", label: "Tréninky", icon: SportsMartialArtsRoundedIcon },
		{ path: "training-plan-creation", label: "Tréninky", icon: SportsMartialArtsRoundedIcon },
		{ path: "diary", label: "Deník", icon: EditNoteRoundedIcon },
		{ path: "sports", label: "Sporty", icon: FitnessCenterRoundedIcon },
		{ path: "connection", label: "Spojení", icon: PolylineRoundedIcon },
		{ path: "chat", label: "Spojení", icon: PolylineRoundedIcon },
		{ path: "profile", label: "Profil", icon: PersonIcon },
	];

	return (
		<Toolbar className="min-h-0 px-0 w-full ">
			<Box className={`w-full `}>
				{pages
					.filter((path) => `/${path.path}` === router.pathname)
					.map(({ path, label, icon: IconComponent }, index) => {
						const isActive = router.pathname === `/${path}`;

						return (
							<Box
								onClick={() => {
									props.externalClicked.setState(!props.externalClicked.state);
								}}
								key={index}
								className="flex  ">
								<Typography className={`text-[1.5rem] font-audiowide tracking-wide transition-all duration-300 ease-in-out  rounded-xl pl-2 pr-1 text-nowrap select-none mt-0`}>
									{IconComponent && (
										<IconComponent
											className={` ${context.windowWidth > 400 ? "mr-2" : "mr-0"}  ${IconComponent === EditNoteRoundedIcon ? "size-[2.3rem] -mt-1.5 " : IconComponent === PersonIcon ? "size-[1.9rem] -mt-1.5" : "size-[1.9rem] -mt-0.5 "}`}
											style={{
												filter: "drop-shadow(3px 3px 3px #00000060)",
											}}
										/>
									)}
									{context.windowWidth > 400 ? label : ""}
								</Typography>
							</Box>
						);
					})}
			</Box>
		</Toolbar>
	);
};

export default NavigationMobile;
