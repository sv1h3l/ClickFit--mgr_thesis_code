import { Box, Typography } from "@mui/material";
import Head from "next/head";

const Page404 = () => {
	return (
		<>
			<Head>
				<title>404 - KlikFit</title>
			</Head>

			<Box className="flex flex-col justify-center items-center h-content -mt-24">
				<Typography className="text-[4rem]">404</Typography>
				<Typography className="text-[1.5rem]">STRÁNKA NENALEZENA</Typography>
			</Box>
		</>
	);
};
export default Page404;
