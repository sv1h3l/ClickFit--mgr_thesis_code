import GeneralCard from "@/components/large/GeneralCard";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { Box, Typography } from "@mui/material";
import Head from "next/head";

const Page404 = () => {
	return (
		<>
			<Head>
				<title>404 - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-full"
				firstColumnHeight="h-2/5"
				secondColumnWidth="w-0"
				secondColumnHeight="h-0"
				firstColumnChildren={
					<Box className="h-full flex justify-center items-center">
						<GeneralCard
							style="h-fit"
							dontShowHr
							zeroYPadding
							firstChildren={
								<Box className="flex flex-col justify-center items-center pb-12 px-6 ">
									<Typography className="text-[4rem]">404</Typography>
									<Typography className="text-[1.5rem]">STRÁNKA NENALEZENA</Typography>
								</Box>
							}
						/>
					</Box>
				}
				secondColumnChildren={<></>}
			/>
		</>
	);
};
export default Page404;
