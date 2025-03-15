import { Value } from "@/api/sportCreationRequestSecond";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface ItemsWindowProps {
	items: Value[];
	setItems: (items: Value[]) => void;
	value: string;
	setValue: (value: string) => void;
	label: string;
	button: string;

	styles?: string;

	showOrderNumbers?: boolean;
	isChecked?: boolean;
	onToggleChange?: (isChecked: boolean) => void;
}

const ItemsWindow = ({ items, setItems, value, setValue, label, button, isChecked, onToggleChange, showOrderNumbers, styles }: ItemsWindowProps) => {
	const parentBoxRef = useRef<HTMLDivElement>(null);
	const firstBoxRef = useRef<HTMLDivElement>(null);
	const lastBoxRef = useRef<HTMLDivElement>(null);
	const [middleBoxHeight, setMiddleBoxHeight] = useState(0);

	const updateMaxHeight = () => {
		if (parentBoxRef.current && firstBoxRef.current && lastBoxRef.current) {
			setMiddleBoxHeight(parentBoxRef.current.clientHeight - firstBoxRef.current.clientHeight - lastBoxRef.current.clientHeight);
		}
	};

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			updateMaxHeight();
		});

		if (parentBoxRef.current) {
			observer.observe(parentBoxRef.current);
		}

		setTimeout(updateMaxHeight, 0);

		return () => observer.disconnect();
	}, []);

	return (
		<Box
			ref={parentBoxRef}
			className={`mt-1 border-2 rounded-xl flex flex-col  overflow-hidden 
                        ${styles}`}>
			{/* Fixed header area */}
			<Box
				ref={firstBoxRef}
				className={`flex-shrink-0 flex justify-between	 border-b-4 border-double border-gray-200 `}>
				<Typography className="p-2  text-lg">{label} </Typography>

				{onToggleChange && (
					<FormControlLabel
						control={
							<Checkbox
								checked={isChecked}
								onChange={(e) => {
									onToggleChange(e.target.checked);
								}}
							/>
						}
						label=""
					/>
				)}
			</Box>

			{/* Scrollable content */}
			<Box
				style={{ maxHeight: `${middleBoxHeight}px` }}
				className={`flex-grow overflow-auto min-h-0  ${onToggleChange && !isChecked && "opacity-50"}`}>
				{items.map((item) => (
					<Box
						className={`flex border-b-2 border-gray-100
										${item.orderNumber % 2 !== 0 && "bg-gray-50"}`}
						key={item.orderNumber}>
						{showOrderNumbers && <Typography className="py-1 px-2 border-r-2 w-9 text-center border-gray-200">{item.orderNumber}</Typography>}

						<Typography className="py-1 px-2">{item.name}</Typography>
					</Box>
				))}
			</Box>

			{/* Fixed input area */}
			<Box
				ref={lastBoxRef}
				className={`flex p-2 border-t-2  border-gray-300 flex-shrink-0 ${onToggleChange && !isChecked && "opacity-50"}`}>
				<TextField
					disabled={onToggleChange && !isChecked}
					className="w-full"
					placeholder={button}
					variant="standard"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							if (value.trim() === "") return;
							setItems([...items, { orderNumber: items.length + 1, name: value }]);
							setValue("");
						}
					}}
				/>
				<Button
					disabled={onToggleChange && !isChecked}
					onClick={() => {
						if (value.trim() === "") return;
						setItems([...items, { orderNumber: items.length + 1, name: value }]);
						setValue("");
					}}
					size="small"
					className="w-auto h-auto p-1 min-w-8 ml-2">
					<AddIcon
						className="text-green-500"
						fontSize="small"
					/>
				</Button>
			</Box>
		</Box>
	);
};

export default ItemsWindow;
