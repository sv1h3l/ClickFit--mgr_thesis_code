import { StateAndSet } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { SportDifficulty } from "../large/SportDescriptionAndSettings";

interface ItemsWindowProps {
	items: SportDifficulty[];
	newItem: () => void;
	value: string;
	setValue: (value: string) => void;
	label: string;
	button: string;

	handleMove: (orderNumber: number, direction: "up" | "down") => void;
	handleDelete: (difficultyId: number, orderNumber: number) => void;

	editing?: StateAndSet<boolean>;

	styles?: string;
	showOrderNumbers?: boolean;
	showCheckBox?: boolean;
	isChecked?: boolean;
	onToggleChange?: (isChecked: boolean) => void;
}

const ItemsWindow = ({ items, newItem, value, setValue, label, button, isChecked, handleMove, handleDelete, editing, showCheckBox, onToggleChange, showOrderNumbers, styles }: ItemsWindowProps) => {
	const MoveAndDeleteButtons = (props: { entityId: number; orderNumber: number }) => {
		const disableUpArrow = props.orderNumber === 1;
		const disableDownArrow = props.orderNumber === items.length;
		const disableDelete = 1 === items.length;

		return (
			<Box className="ml-auto flex relative">
				<Button
					disabled={disableUpArrow || !isChecked}
					onClick={() => handleMove(props.orderNumber, "up")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 ml-3
								${disableUpArrow && "opacity-30"}`}>
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					disabled={disableDownArrow || !isChecked}
					onClick={() => handleMove(props.orderNumber, "down")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 
								${disableDownArrow && "opacity-30"}`}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					disabled={disableDelete || !isChecked}
					onClick={() => handleDelete(props.entityId, props.orderNumber)}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 ml-3 mr-2
								${disableDelete && "opacity-30"}`}>
					<CloseIcon
						className="text-red-400"
						fontSize="small"
					/>
				</Button>
			</Box>
		);
	};

	return (
		<Box
			className={`mt-1 border-2 rounded-xl flex flex-col  overflow-hidden 
                        ${styles}`}>
			{/* Fixed header area */}
			<Box className={`flex-shrink-0 flex justify-between	 border-b-4 border-double border-gray-200 `}>
				<Typography className={`p-2 ${onToggleChange && !isChecked && "opacity-50"}`}>{label} </Typography>

				{onToggleChange && showCheckBox && (
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
			<Box className={`flex-grow overflow-auto min-h-0  ${onToggleChange && !isChecked && "opacity-50"}`}>
				{items.map((item) =>
					item.orderNumber === 0 ? (
						<></>
					) : (
						<Box
							className={`flex border-b-2 border-gray-100
										${item.orderNumber % 2 !== 0 && "bg-gray-50"}`}
							key={item.orderNumber}>
							{showOrderNumbers && <Typography className="py-1 px-2 border-r-2 w-9 text-center border-gray-200">{item.orderNumber}</Typography>}

							<Typography className="py-1 px-3">{item.difficultyName}</Typography>

							{editing?.state && (
								<MoveAndDeleteButtons
									entityId={item.sportDifficultyId}
									orderNumber={item.orderNumber}
								/>
							)}
						</Box>
					)
				)}
			</Box>

			{/* Fixed input area */}
			<Box className={`flex p-2 border-t-2  border-gray-300 flex-shrink-0 ${onToggleChange && !isChecked && "opacity-50"}`}>
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
							newItem();
							setValue("");
						}
					}}
				/>
				<Button
					disabled={onToggleChange && !isChecked}
					onClick={() => {
						if (value.trim() === "") return;
						newItem();
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
