import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { SportDifficulty } from "../large/SportDescriptionAndSettings";
import ButtonComp, { IconEnum } from "./ButtonComp";

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
	const context = useAppContext();

	const MoveAndDeleteButtons = (props: { entityId: number; orderNumber: number }) => {
		const disableUpArrow = props.orderNumber === 1;
		const disableDownArrow = props.orderNumber === items.length;
		const disableDelete = 1 === items.length;

		return (
			<Box className="ml-auto flex items-center mr-3 gap-2 mb-0.5">
				<ButtonComp
					disabled={disableUpArrow || !isChecked}
					content={IconEnum.ARROW}
					contentStyle="-rotate-90"
					dontChangeOutline
					justClick
					onClick={() => {
						setTimeout(() => handleMove(props.orderNumber, "up"), 100);
					}}
					size="small"
				/>

				<ButtonComp
					disabled={disableDownArrow || !isChecked}
					content={IconEnum.ARROW}
					contentStyle="rotate-90"
					dontChangeOutline
					justClick
					onClick={() => {
						setTimeout(() => handleMove(props.orderNumber, "down"), 100);
					}}
					size="small"
				/>

				<ButtonComp
					style="ml-2.5"
					disabled={disableDelete || !isChecked}
					content={IconEnum.CROSS}
					contentStyle="rotate-90"
					dontChangeOutline
					justClick
					onClick={() => {
						setTimeout(() => handleDelete(props.entityId, props.orderNumber), 100);
					}}
					size="small"
				/>
			</Box>
		);
	};

	return (
		<Box
			className={`mt-1 border-2 rounded-xl flex flex-col  overflow-hidden 
						${context.bgPrimaryColor + context.borderPrimaryColor}
                        ${styles}`}>
			<Box
				className={`flex-shrink-0 flex justify-between	 border-b-2
							${context.borderTertiaryColor + context.bgTertiaryColor} `}>
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

			<Box className={`flex-grow overflow-auto min-h-0  ${onToggleChange && !isChecked && "opacity-50"}`}>
				{items.map((item, index) =>
					item.orderNumber === 0 ? (
						<></>
					) : (
						<Box
							className={`flex  items-center h-11
										${index === items.length - 1 ? "border-b-0" : "border-b-2"}
										${context.borderPrimaryColor}
										${item.orderNumber % 2 === 0 && context.bgSecondaryColor}`}
							key={item.orderNumber}>
							{showOrderNumbers && (
								<Box className={` flex  px-2 border-r-2 w-9 h-full  ${context.borderSecondaryColor} ${""}`}>
									<Typography className="m-auto text-center">{item.orderNumber}</Typography>{" "}
								</Box>
							)}

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

			{editing?.state ? (
				<Box
					className={`flex border-t-2   flex-shrink-0  h-11 items-center
								${context.borderTertiaryColor} ${items.length % 2 !== 0 && context.bgSecondaryColor}
								${onToggleChange && !isChecked && "opacity-50"}`}>
					{showOrderNumbers && (
						<Box className={` flex  px-[0.8rem]  border-r-2 w-9 h-full  ${context.borderSecondaryColor} ${""}`}>
							<Typography className="m-auto text-center">{items.length + 1}</Typography>{" "}
						</Box>
					)}
					<TextField
						disabled={onToggleChange && !isChecked}
						className="w-full ml-3 -mt-1"
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

					<ButtonComp
						style="ml-3 mr-3"
						size="small"
						justClick
						dontChangeOutline
						content={IconEnum.PLUS}
						onClick={() => {
							setTimeout(() => {
								if (value.trim() === "") return;
								newItem();
								setValue("");
							}, 100);
						}}
					/>
				</Box>
			) : null}
		</Box>
	);
};

export default ItemsWindow;
