import { Box } from "@mui/material";
import { ReactNode } from "react";

interface SingleColumnPageProps {
    width?: string;
    height?: string;
    children: ReactNode;
}

const SingleColumnPage = ({ width, height, children }: SingleColumnPageProps) => {
    return (
        <Box className="flex justify-center h-content">
            <Box
                className={`${width || "w-full"} ${height || "h-full"}
						bg-white border-x-2 border-b-2 border-gray-200 rounded-br-3xl `}
            >
                {children}
            </Box>
        </Box>
    );
};

export default SingleColumnPage;
