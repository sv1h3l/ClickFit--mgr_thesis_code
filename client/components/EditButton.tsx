import { StateAndSet } from "@/utilities/generalInterfaces";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button } from "@mui/material";

interface EditButtonProps {
	disabled?: boolean;

	editing: StateAndSet<boolean>;
}

const EditButton = ({ props }: { props: EditButtonProps }) => {
	return (
		<Box className="-ml-2 mt-1">
			<Button
				disabled={props.disabled}
				className={`w-auto h-auto p-1 min-w-8 ml-2`}
				onClick={() => {
					props.editing.setState(!props.editing.state);
				}}>
				{props.editing.state ? (
					<SaveIcon
						className={`${props.disabled ? "text-gray-300" : "text-blue-500"} `}
						fontSize="small"
					/>
				) : (
					<EditIcon
						className={`${props.disabled ? "text-gray-300" : "text-blue-500"} `}
						fontSize="small"
					/>
				)}
			</Button>
		</Box>
	);
};

export default EditButton;
