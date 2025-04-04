import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import CrossIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button } from "@mui/material";
import { useState } from "react";

// Enum pro ikony
export enum IconEnum {
	EDIT = "Edit",
	SAVE = "Save",
	CROSS = "Cross",

	ARROW = "Arrow",
	ARROW_DROP_UP = "ArrowDropUp",
	ARROW_DROP_DOWN = "ArrowDropDown",

	LOGOUT = "Logout",
	SETTINGS = "Settings",
}

interface Props {
	onClick: () => void;
	icon: IconEnum;
	color?: string;

	disabled?: boolean;

	style?: string;
	size?: "small" | "medium" | "large";
}

const ButtonComp = (props: Props) => {
	const iconMap = {
		[IconEnum.EDIT]: EditIcon,
		[IconEnum.SAVE]: SaveIcon,
		[IconEnum.CROSS]: CrossIcon,

		[IconEnum.ARROW]: ArrowIcon,
		[IconEnum.ARROW_DROP_UP]: ArrowDropUpIcon,
		[IconEnum.ARROW_DROP_DOWN]: ArrowDropDownIcon,

		[IconEnum.LOGOUT]: LogoutTwoToneIcon,
		[IconEnum.SETTINGS]: SettingsIcon,
	};

	const IconComponent = iconMap[props.icon];

	const [enabled, setEnabled] = useState(false);

	return (
		<Box
			className={`w-fit h-fit rounded-lg  bg-navigation-color-neutral
						outline overflow-hidden
						transition duration-150 ease-in-out  
						${props.style} ${enabled ? "scale-90 outline-[2px] outline-[#606060] translate-y-0.5" : " btn-border-color  outline-[2px] outline-[#2b2b27]"}`}>
			<Button
				disabled={props.disabled}
				className={`w-auto h-auto min-h-0 min-w-0 rounded-none p-1 `}
				onClick={() => {
					setEnabled(!enabled);
					props.onClick();
				}}>
				<IconComponent
					sx={{
						position: "relative",
						color: "white", // Barva hlavní ikony
						"&::before": {
							content: '""',
							position: "absolute",
							width: "100%",
							height: "100%",
							top: 0,
							left: 0,
							background: "black",
							filter: "blur(4px)",
							opacity: 0.4,
						},
					}}
					className={` ${props.size === "large" ? "size-[1.75rem]" : props.size === "medium" ? "size-[1.5rem]" : "size-[1.25rem]"}  `}
				/>
			</Button>
		</Box>
	);
};

export default ButtonComp;
