import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CrossIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SportsMartialArtsRoundedIcon from "@mui/icons-material/SportsMartialArtsRounded";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// Enum pro ikony
export enum IconEnum {
	EDIT = 1,
	CHECK = 2,
	SAVE = 3,
	CROSS = 4,
	TRASH = 15,

	PLUS = 16,

	ARROW = 5,
	ARROW_DROP_UP = 6,
	ARROW_DROP_DOWN = 7,
	BACK = 8,

	PROFILE = 9,
	SETTINGS = 10,
	LOGOUT = 11,

	FLAG = 12,
	EYE = 13,
	EYE_HIDDEN = 14,

	SEND = 17,
	CHART = 18,
	QUESTION = 19,
	TRAININGS = 20,
	SHARE = 21,
	MENU = 22,
}

interface Props {
	onClick?: () => void;
	content: IconEnum | string;
	secondContent?: IconEnum;
	saveIconStyle?: string;
	contentStyle?: string;
	secondContentStyle?: string;

	color?: string;

	disabled?: boolean;
	quickDisable?: boolean;
	hidden?: boolean;
	externalClicked?: StateAndSet<boolean>;
	externalClickedVal?: boolean;

	style?: string;
	size?: "small" | "medium" | "large";

	justClick?: boolean;
	saveAnimation?: boolean;

	dontChangeOutline?: boolean;
}

const ButtonComp = (props: Props) => {
	const iconMap = {
		[IconEnum.EDIT]: EditIcon,
		[IconEnum.CHECK]: CheckRoundedIcon,
		[IconEnum.SAVE]: SaveIcon,
		[IconEnum.CROSS]: CrossIcon,
		[IconEnum.TRASH]: DeleteForeverIcon,

		[IconEnum.PLUS]: AddIcon,

		[IconEnum.ARROW]: ArrowIcon,
		[IconEnum.ARROW_DROP_UP]: ArrowDropUpIcon,
		[IconEnum.ARROW_DROP_DOWN]: ArrowDropDownIcon,
		[IconEnum.BACK]: ArrowBackIosRoundedIcon,

		[IconEnum.PROFILE]: PersonIcon,
		[IconEnum.SETTINGS]: SettingsIcon,
		[IconEnum.LOGOUT]: ExitToAppIcon,

		[IconEnum.FLAG]: FlagIcon,
		[IconEnum.EYE]: VisibilityIcon,
		[IconEnum.EYE_HIDDEN]: VisibilityOffIcon,

		[IconEnum.SEND]: SendRoundedIcon,
		[IconEnum.CHART]: BarChartIcon,
		[IconEnum.QUESTION]: QuestionMarkIcon,
		[IconEnum.TRAININGS]: SportsMartialArtsRoundedIcon,
		[IconEnum.SHARE]: NoteAddIcon,
		[IconEnum.MENU]: MenuRoundedIcon,
	};

	const context = useAppContext();

	const IconComponent = typeof props.content === "number" ? iconMap[props.content] : null;

	const SecondIconComponent = typeof props.secondContent === "number" ? iconMap[props.secondContent] : null;

	const [clicked, setClicked] = useState(false);

	useEffect(() => {
		if (props.externalClickedVal !== undefined) setClicked(props.externalClickedVal);
	}, [props.externalClickedVal]);

	const [hideDefaultIcon, setHideDefaultIcon] = useState(false);
	const [showSave, setShowSave] = useState(false);

	let color = "text-[#eDeDeD]";

	switch (props.content) {
		case IconEnum.EDIT:
		case IconEnum.QUESTION:
		case IconEnum.ARROW: {
			color = "text-blue-icon";
			break;
		}

		case IconEnum.CHECK:
		case IconEnum.PLUS: {
			color = "text-green-icon";
			break;
		}

		case IconEnum.CROSS:
		case IconEnum.TRASH: {
			color = "text-red-icon";
			break;
		}
	}

	switch (props.secondContent) {
		case IconEnum.EDIT:
		case IconEnum.ARROW: {
			color = "text-blue-icon";
			break;
		}

		case IconEnum.CHECK:
		case IconEnum.PLUS: {
			color = "text-green-icon";
			break;
		}

		case IconEnum.CROSS:
		case IconEnum.TRASH: {
			color = "text-red-icon";
			break;
		}
	}

	color = props.color || color;

	useEffect(() => {
		if (props.disabled) setClicked(false);
	}, [props.disabled]);

	return (
		<Box className={`${props.hidden && "opacity-0"}`}>
			<SaveIcon
				className={`text-blue-icon absolute transition duration-300 ease-in-out 
							${props.saveIconStyle ? props.saveIconStyle : props.contentStyle}
							${showSave ? "opacity-100" : "opacity-0"}
							${props.size === "large" ? "size-[1.75rem]" : props.size === "medium" ? "size-[1.5rem]" : props.size === "small" ? "size-[1.25rem]" : "size-[1rem]"}`}
				style={{
					filter: "drop-shadow(3px 3px 3px #00000060)",
				}}
			/>
			{/* ml-[0.125rem] mt-[0.125rem] */}

			<Box
				className={` w-fit h-fit  
							outline overflow-hidden flex items-center justify-center
							transition duration-200 ease-in-out  
							${IconComponent || (props.content.toString().length <= 2 && "aspect-square")}
							${props.style}
							${hideDefaultIcon ? "opacity-0" : props.disabled ? "opacity-40" : ""}
							${props.size ? "rounded-lg" : "rounded-md"}
							${(props.externalClicked === undefined && clicked) || props.externalClicked?.state ? `scale-[0.9] outline-[2px]  ${context.bgTertiaryColor}` : `shadow-black shadow-md outline-[2px] ${context.bgQuaternaryColor} `} 
							${(props.externalClicked === undefined && clicked && !props.dontChangeOutline) || (props.externalClicked?.state && !props.dontChangeOutline) ? context.borderQuaternaryColor : context.borderPrimaryColor} 
							`}>
				{/*${!hideDefaultIcon ? props.style : ""}				translate-y-0.5*/}
				<Button
					disabled={props.disabled || !props.onClick || props.quickDisable}
					className={`w-full h-full min-h-0 min-w-0 rounded-none  flex items-center justify-center
								${IconComponent ? "p-1" : "p-0.5"} ?`}
					sx={{
						...(props.quickDisable &&
							!props.disabled && {
								opacity: 1,
								pointerEvents: "none",
							}),
					}}
					disableRipple
					onClick={() => {
						if (props.onClick) {
							if (props.externalClicked) {
								props.externalClicked.setState(!props.externalClicked.state);
							} else {
								if (props.justClick) {
									setClicked(true);
									if (props.saveAnimation) {
										setTimeout(() => {
											setHideDefaultIcon(true);
										}, 125);

										setTimeout(() => {
											setShowSave(true);
										}, 225);

										setTimeout(() => {
											setShowSave(false);
										}, 1200);

										setTimeout(() => {
											setHideDefaultIcon(false);
										}, 1300);

										setTimeout(() => {
											setClicked(false);
										}, 600);
									} else {
										setTimeout(() => {
											setClicked(false);
										}, 250);
									}
								} else {
									setClicked(!clicked);
								}
							}

							props.onClick();
						}
					}}>
					<>
						{IconComponent ? (
							<IconComponent
								className={`${props.contentStyle}
								${color} 
								${props.size === "large" ? "size-[1.5rem]" : props.size === "medium" ? "size-[1.25rem]" : props.size === "small" ? "size-[1rem]" : "size-[0.75rem]"}
								${(props.content === IconEnum.ARROW_DROP_UP || props.content === IconEnum.ARROW_DROP_DOWN) && "scale-150"}`}
								style={{
									filter: "drop-shadow(3px 3px 3px #00000060)",
								}}
							/>
						) : props.content.toString().length <= 2 ? (
							<Typography
								className={`-mt-[0.4rem]   font-light text-center
										${props.content.toString().length === 2 ? "ml-[0.05rem] mr-[0.2rem]" : "ml-0.5 mr-0.5"}
										${props.contentStyle}
										${color} 
										${props.size === "large" ? "size-[1.5rem]" : props.size === "medium" ? "size-[1.25rem]" : props.size === "small" ? "size-[1rem] " : "size-[0.75rem]"}`}>
								{props.content}
							</Typography>
						) : (
							<Typography
								className={` tracking-wider normal-case px-1.5 py-0.5 
									${props.contentStyle}
									 ${props.size === "large" ? "text-[1.1rem]" : props.size === "medium" ? "text-base" : props.size === "small" ? "text-sm " : "text-xs "}`}>
								{props.content}
							</Typography>
						)}

						{SecondIconComponent ? (
							<SecondIconComponent
								className={`
									${props.secondContentStyle}
									${color} 
									${props.size === "large" ? "size-[1.5rem]" : props.size === "medium" ? "size-[1.25rem]" : props.size === "small" ? "size-[1rem]" : "size-[0.75rem]"}
									${(props.content === IconEnum.ARROW_DROP_UP || props.content === IconEnum.ARROW_DROP_DOWN) && "scale-150"}`}
								style={{
									filter: "drop-shadow(3px 3px 3px #00000060)",
								}}
							/>
						) : null}
					</>
				</Button>
			</Box>
		</Box>
	);
};

export default ButtonComp;
