import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

interface TextFieldWithPlusProps {
	placeHolder: string;

	onClick: (value: string) => void;

	border?: boolean;

	titleBorderWidth?: string;

	isChecked?: boolean;
	onToggleChange?: (isChecked: boolean) => void;

	style?: string;
}

const TextFieldWithPlus = ({ props }: { props: TextFieldWithPlusProps }) => {
	const [value, setValue] = useState<string>("");

	const handleAction = () => {
		if (value.trim() === "") return;

		if (props.onClick) {
			props.onClick(value);
		}
		setValue("");
	};

	return (
		<Box
			className={`flex py-2 flex-shrink-0 relative
                        ${props.border && "border-t-2 border-gray-300 "} ${props.onToggleChange && !props.isChecked && "opacity-50"} ${props.style}`}>
			{props.titleBorderWidth && (
				<Box
					style={{ width: props.titleBorderWidth }}
					className="border-t-2 border-l-2 border-gray-200 h-6 rounded-tl-xl absolute -left-3 -mt-1"
				/>
			)}

			<TextField
				disabled={props.onToggleChange && !props.isChecked}
				className="w-full"
				placeholder={props.placeHolder}
				variant="standard"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						handleAction();
					}
				}}
			/>
			<Button
				disabled={props.onToggleChange && !props.isChecked}
				onClick={handleAction}
				size="small"
				className="w-auto h-auto p-1 min-w-8 ml-2">
				<AddIcon
					className="text-green-500"
					fontSize="small"
				/>
			</Button>
		</Box>
	);
};

export default TextFieldWithPlus;
