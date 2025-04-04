import { Box } from "@mui/material";
import { ReactNode } from "react";
import Header from "./Header";

function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<div className=" flex justify-center  ">
				<Box className="max-w-content w-full">
					<Header />
				</Box>
			</div>
			{/*<Image
				className="absolute top-10 left-14 z-0 opacity-90 -rotate-12"
				src="/icons/logo.webp"
				alt="Logo"
				width={250}
				height={50}
				priority
			/>*/}

			<div className="flex justify-center w-full  ">
				<div className=" max-w-content w-full ">
					<main>{children}</main>
				</div>
			</div>
		</>
	);
}

export default Layout;
