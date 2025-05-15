import { useAppContext } from "@/utilities/Context";
import { AppBar, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import MenuMobile from "./MenuMobile";
import NavigationMobile from "./NavigationMobile";

const cookie = require("cookie");

function HeaderMobile() {
	const [user, setUser] = useState<any>(null);
	const [externalClicked, setExternalClicked] = useState(false);

	const context = useAppContext();

	useEffect(() => {
		const checkUserCookie = () => {
			const cookies = cookie.parse(document.cookie);
			const authToken = cookies.authToken || null;

			if (authToken) {
				setUser(authToken);
			}
		};

		checkUserCookie();

		const interval = setInterval(checkUserCookie, 10);
		return () => clearInterval(interval);
	}, []);

	return user ? (
		<AppBar className="bg-transparent shadow-none text-center relative h-[3rem] ">
			<Box className="justify-center mx-2 relative">
				<Box className={`w-full max-w-content   shadow-black shadow-md items-center flex border-x-[3px] border-b-[3px]  rounded-b-3xl ${context.bgPrimaryColor} ${context.borderPrimaryColor}`}>
					<Typography className="w-fit text-center text-[2.5rem] ml-5  -mb-1 h-16 font-audiowide tracking-widest">KlikFit</Typography>
					<Box className="flex  gap-3 ml-auto w-fit items-center ">
						<NavigationMobile externalClicked={{ state: externalClicked, setState: setExternalClicked }} />
						<ButtonComp
							externalClicked={{ state: externalClicked, setState: setExternalClicked }}
							content={externalClicked ? IconEnum.CROSS : IconEnum.MENU}
							color="text-white"
							size="large"
							contentStyle="scale-[1.1]"
							style="mr-5 "
							onClick={() => {}}
						/>

						<MenuMobile user={{state: user, setState: setUser}} externalClicked={{ state: externalClicked, setState: setExternalClicked }} />
					</Box>
				</Box>
			</Box>
		</AppBar>
	) : (
		<Box className="flex flex-col w-full max-w-content justify-center items-center mt-4">
			<Image
				className="h-[4.5rem] w-auto mr-1"
				src={context.logoColor}
				alt="Logo"
				width={150}
				height={150}
				priority
			/>
			<Typography className="text-[2.5rem] mt-2  font-audiowide tracking-widest">KlikFit</Typography>
		</Box>
	);
}

export default HeaderMobile;
