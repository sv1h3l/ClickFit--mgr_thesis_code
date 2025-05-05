import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";
import SportsMartialArtsRoundedIcon from "@mui/icons-material/SportsMartialArtsRounded";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

interface Props {
	externalClicked: StateAndSet<boolean>;
}

const Navigation = (props: Props) => {
	const router = useRouter();

	const colors = useAppContext();

	const pages = [
		{ path: "training-plans", label: "Tréninky", icon: SportsMartialArtsRoundedIcon },
		{ path: "diary", label: "Deník", icon: EditNoteRoundedIcon },
		{ path: "sports", label: "Sporty", icon: FitnessCenterRoundedIcon },
		{ path: "connection", label: "Spojení", icon: PolylineRoundedIcon },
	];

	const navigate = (link: string) => {
		props.externalClicked.setState(false);

		router.push(`/${link}`);
	};

	return (
		<Toolbar className="min-h-0 px-0 w-full ">
			<Box
				className={`w-full rounded-br-3xl rounded-tl-3xl  flex justify-end shadow-md border-[3px]
							${colors.bgTertiaryColor} ${colors.borderTertiaryColor}`}>
				{pages.map(({ path, label, icon: IconComponent }, index) => {
					const isActive = router.pathname === `/${path}`;

					return (
						<Box
							key={index}
							className="flex justify-center w-1/4">
							<Button
								onClick={() => navigate(path)}
								className="h-[2.7rem] normal-case "
								disableRipple>
								<Typography
									className={`text-[1.3rem] font-audiowide tracking-wide transition-all duration-300 ease-in-out  rounded-xl pl-2 pr-3
										${isActive ? `  border-2  ${colors.bgPrimaryColor} ${colors.borderPrimaryColor}` : "border-transparent  "}`}>
									{IconComponent && <IconComponent className={`mr-2 
																				${IconComponent === EditNoteRoundedIcon ? "size-[1.9rem] -mt-1.5 " : "size-[1.5rem] -mt-0.5 "}`} 
																				style={{
																					filter: "drop-shadow(3px 3px 3px #00000060)",
																				}}/>}
									{label}
								</Typography>
							</Button>
						</Box>
					);
				})}
			</Box>
		</Toolbar>
	);
};

export default Navigation;
