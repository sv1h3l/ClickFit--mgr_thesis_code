import { StateAndSet } from "@/utilities/generalInterfaces";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button } from "@mui/material";

interface EditButtonProps {
	disabled?: boolean;

	style?: string;

	editing: StateAndSet<boolean>;
}

const EditButton = ({ disabled, editing, style }: EditButtonProps) => {
	return (
		<Box className={`-ml-2 mt-1
						${style}`}>
			<Button
				disabled={disabled}
				className={`w-auto h-auto p-1 min-w-8 ml-2`}
				onClick={() => {
					editing.setState(!editing.state);
				}}>
				{editing.state ? (
					<SaveIcon
						className={`${disabled ? "text-gray-300" : "text-blue-500"} `}
						fontSize="small"
					/>
				) : (
					<EditIcon
						className={`${disabled ? "text-gray-300" : "text-blue-500"} `}
						fontSize="small"
					/>
				)}
			</Button>
		</Box>
	);
};

export default EditButton;
