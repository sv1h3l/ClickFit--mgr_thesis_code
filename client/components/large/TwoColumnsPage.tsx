import { useAppContext } from "@/utilities/Context";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TwoColumnsPageProps {
	firstColumnWidth?: string;
	secondColumnWidth?: string;
	firstColumnHeight?: string;
	secondColumnHeight?: string;
	firstColumnChildren: ReactNode;
	secondColumnChildren: ReactNode;
}

const TwoColumnsPage = ({ firstColumnWidth, secondColumnWidth, firstColumnHeight, secondColumnHeight, firstColumnChildren, secondColumnChildren }: TwoColumnsPageProps) => {
	const context = useAppContext();

	return (
		<Box className={`flex justify-center  pt-7  pb-1.5 px-2 w-full
						${context.isSmallDevice ? "h-[calc(100dvh-3rem)]" : "h-content"}`}>
			<Box
				className={`${firstColumnWidth || "w-1/2"} ${firstColumnHeight || "h-full "} rounded-3xl pb-1  ${(secondColumnWidth !== "w-0" && firstColumnWidth !== "w-0") && "pr-2"}
						 relative    `}>
				{firstColumnChildren}
			</Box>
			<Box
				className={`${secondColumnWidth || "w-1/2"} ${secondColumnHeight || "h-full"}  pb-1  ${(secondColumnWidth !== "w-0" && firstColumnWidth !== "w-0") && "pl-2"}
						 rounded-3xl relative border-[#181818] `}>
				{secondColumnChildren}
			</Box>
		</Box>
	);
};

export default TwoColumnsPage;
