import { Box } from "@mui/material";
import { ReactNode } from "react";

interface WideTwoColumnsPageProps {
	setColumnsSameWidth: boolean;
	firstColumnChildren: ReactNode;
	secondColumnChildren: ReactNode;
}

const WideTwoColumnsPage = ({ setColumnsSameWidth, firstColumnChildren, secondColumnChildren }: WideTwoColumnsPageProps) => {
	return (
		<Box className="flex justify-center h-content">
			<Box className={`${setColumnsSameWidth ? "w-1/2" : "w-1/3"} h-full bg-white relative border-l-2 border-gray-200 `}>{firstColumnChildren}</Box>
			{/*  outline outline-2 outline-green-500 */}
			<Box className={`${setColumnsSameWidth ? "w-1/2" : "w-2/3"} h-full bg-white rounded-br-3xl border-r-2 border-b-2 relative border-gray-200 `}>{secondColumnChildren}</Box>
			{/*  outline outline-2 outline-red-500 */}
		</Box>
	);
};

export default WideTwoColumnsPage;
