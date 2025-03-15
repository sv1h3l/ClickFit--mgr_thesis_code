import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface TextFieldWithPlusProps {
	previousValue?: string;
	placeHolder: string;

	onClick: (value: string) => void;
	icon?: React.ReactNode;
	dontDeleteValue?: boolean;

	border?: boolean;

	titleBorderWidth?: string;

	isChecked?: boolean;
	onToggleChange?: (isChecked: boolean) => void;

	style?: string;
	noPaddingY?: boolean;
}

const TextFieldWithIcon = ({ previousValue, placeHolder, onClick, icon, dontDeleteValue, border, titleBorderWidth, isChecked, onToggleChange, style, noPaddingY }: TextFieldWithPlusProps) => {
	const [value, setValue] = useState<string>(previousValue || "");

	useEffect(() => {
		if (previousValue !== value) {
			setValue(previousValue || "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previousValue]);

	const handleAction = () => {
		if (value.trim() === "") return;

		if (onClick) {
			onClick(value);
		}

		!dontDeleteValue && setValue("");
	};

	return (
		<Box
			className={`flex flex-shrink-0 relative
                        ${!noPaddingY && "py-2"} ${border && "border-t-2 border-blue-300 "} ${onToggleChange && !isChecked && "opacity-50"} ${style}`}>
			{titleBorderWidth && (
				<Box
					style={{ width: titleBorderWidth }}
					className="border-t-2 border-l-2 border-blue-300 h-6 rounded-tl-lg absolute -left-2.5 -mt-1"
				/>
			)}

			<TextField
				disabled={onToggleChange && !isChecked}
				className="w-full "
				placeholder={placeHolder}
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
				disabled={onToggleChange && !isChecked}
				onClick={handleAction}
				size="small"
				className="w-auto h-auto p-1 min-w-8 ml-2">
				{icon ? (
					icon
				) : (
					<AddIcon
						className="text-green-500"
						fontSize="small"
					/>
				)}
			</Button>
		</Box>
	);
};

export default TextFieldWithIcon;
