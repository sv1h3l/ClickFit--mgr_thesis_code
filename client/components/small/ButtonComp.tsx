import { StateAndSet } from "@/utilities/generalInterfaces";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CrossIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { Box, Button } from "@mui/material";
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
}

interface Props {
	onClick: () => void;
	icon: IconEnum;
	iconStyle?: string;
	color?: string;

	disabled?: boolean;
	hidden?: boolean;
	externalClicked?: StateAndSet<boolean>;

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
	};

	const IconComponent = iconMap[props.icon];

	const [clicked, setClicked] = useState(false);

	const [hideDefaultIcon, setHideDefaultIcon] = useState(false);
	const [showSave, setShowSave] = useState(false);

	let color = props.color || "text-[#eDeDeD]";

	switch (props.icon) {
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

	useEffect(() => {
		if (props.disabled) setClicked(false);
	}, [props.disabled]);

	return (
		<Box className={`${props.hidden && "opacity-0"}`}>
			<SaveIcon
				className={`text-blue-icon absolute transition duration-300 ease-in-out ml-[0.125rem] mt-[0.125rem]
							${props.iconStyle}
							${showSave ? "opacity-100" : "opacity-0"}
							${props.size === "large" ? "size-[1.75rem]" : props.size === "medium" ? "size-[1.5rem]" : props.size === "small" ? "size-[1.25rem]" : "size-[1rem]"}`}
				style={{
					filter: "drop-shadow(3px 3px 3px #00000060)",
				}}
			/>

			<Box
				className={`aspect-square w-fit h-fit bg-navigation-color-neutral  outline-[#2b2b27]
							outline overflow-hidden flex items-center justify-center
							transition duration-200 ease-in-out  
							${!hideDefaultIcon ? props.style : ""}
							${hideDefaultIcon ? "opacity-0" : props.disabled ? "opacity-40" : ""}
							${props.size ? "rounded-lg" : "rounded-md"}
							${(props.externalClicked === undefined && clicked) || props.externalClicked?.state ? "scale-90 outline-[2px] translate-y-0.5" : "btn-border-color outline-[2px] "}
							${(props.externalClicked === undefined && clicked && !props.dontChangeOutline) || (props.externalClicked?.state && !props.dontChangeOutline) ? "outline-[#606060]" : ""}
							${(props.icon === IconEnum.ARROW_DROP_UP || props.icon === IconEnum.ARROW_DROP_DOWN) && "scale-[0.75] translate-x-1"}
							${(props.icon === IconEnum.ARROW_DROP_UP || props.icon === IconEnum.ARROW_DROP_DOWN) && (clicked || props.externalClicked?.state) && (props.size ? "scale-[0.63]" : "scale-[0.7]")}`}>
				<Button
					disabled={props.disabled}
					className={`w-full h-full min-h-0 min-w-0 rounded-none p-1 flex items-center justify-center`}
					onClick={() => {
						if (props.externalClicked) {
							props.externalClicked.setState(true);
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
					}}>
					<IconComponent
						className={`${props.iconStyle}
									${color} 
									${props.size === "large" ? "size-[1.5rem]" : props.size === "medium" ? "size-[1.25rem]" : props.size === "small" ? "size-[1rem]" : "size-[0.75rem]"}
									${(props.icon === IconEnum.ARROW_DROP_UP || props.icon === IconEnum.ARROW_DROP_DOWN) && "scale-150"}`}
						style={{
							filter: "drop-shadow(3px 3px 3px #00000060)",
						}}
					/>
				</Button>
			</Box>
		</Box>
	);
};

export default ButtonComp;
