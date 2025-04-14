import { AppBar, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import Navigation from "./Navigation";

const cookie = require("cookie");

function Header() {
	const router = useRouter();

	const [user, setUser] = useState<any>(null);

	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("cs-CZ"));

	const [externalClicked, setExternalClicked] = useState(false);

	useEffect(() => {
		// Tato funkce se zavolá při každé změně cookies
		const checkUserCookie = () => {
			const cookies = cookie.parse(document.cookie);
			const authToken = cookies.authToken || null; // Retrieve the userEmail cookie if available

			if (authToken) {
				setUser(authToken);
			}
		};

		checkUserCookie(); // Zavoláme ihned po mountu

		// Sledování změn cookies každých 10ms
		const interval = setInterval(checkUserCookie, 10);
		return () => clearInterval(interval); // Po odpojení komponenty zastavíme interval
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString("cs-CZ"));
		}, 1000);

		return () => clearInterval(interval);
	});

	const handleLogout = () => {
		document.cookie = "authToken=; max-age=0; path=/"; // Vymazání cookie
		setUser(null);
		router.push("/");
	};

	{
		/*user && (
									<Box className="text-center  w-1/3">
										<Typography className="text-[2.8rem]"> {currentTime} </Typography>
									</Box>
								)*/
	}

	return (
		<>
			<AppBar className="bg-transparent shadow-none text-center relative ">
				<Box className="   justify-center    px-1">
					<Box className="flex  w-full max-w-content   ">
						<Box className="w-1/6 justify-center items-center  flex border-l-[3px] border-b-[3px] rounded-bl-3xl h-28   bg-primary-color-neutral">
							<Image
								className="w-auto h-[5.2rem]   "
								src="/icons/logo-gray.webp"
								alt="Logo"
								width={150}
								height={150}
								priority
							/>
						</Box>
						<Box className="w-4/6 flex flex-col   rounded-br-3xl  h-28   bg-primary-color-neutral">
							<Typography className="text-[3.1rem] -mt-1 h-16 font-audiowide tracking-widest">KlikFit</Typography>

							<Box className=" w-full flex justify-center	 mt-[0.15rem]">{user && <Navigation externalClicked={{ state: externalClicked, setState: setExternalClicked }} />}</Box>
						</Box>

						<Box className=" w-1/6 h-[4.1rem] flex items-center justify-center  border-r-[3px] border-b-[3px] rounded-br-3xl    bg-primary-color-neutral">
							{user && (
								<Box className="flex w-full justify-between px-10">
									<ButtonComp
										style=""
										size="medium"
										icon={IconEnum.PROFILE}
										externalClicked={{ state: externalClicked, setState: setExternalClicked }}
										onClick={() => {
											router.push(`/profile`);
										}}
									/>

									<ButtonComp
										style=""
										size="medium"
										icon={IconEnum.SETTINGS}
										onClick={() => {}}
									/>

									<ButtonComp
										style=""
										size="medium"
										icon={IconEnum.LOGOUT}
										onClick={handleLogout	}
									/>
								</Box>
							)}
						</Box>
					</Box>
				</Box>
			</AppBar>
		</>
	);
}

export default Header;
