import { useAppContext } from "@/utilities/Context";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TwoColumnsPageProps {
	firstColumnWidth?: string;
	firstColumnHeight?: string;
	firstColumnChildren: ReactNode;
}

const OneColumnPage = ({ firstColumnWidth, firstColumnHeight, firstColumnChildren }: TwoColumnsPageProps) => {
	const context = useAppContext()

	return (
		<Box className={`flex justify-center  h-content-prelog  px-1 w-full ${context.windowWidth < 750 ? "" : context.windowWidth < 1440 ? "pt-3.5" : "pt-7"}`}>
			<Box
				className={`${firstColumnWidth || "w-1/2"} ${firstColumnHeight || "h-full "} rounded-3xl pb-1    mt-4
						    `}>
				{firstColumnChildren}
			</Box>
		</Box>
	);
};

export default OneColumnPage;
