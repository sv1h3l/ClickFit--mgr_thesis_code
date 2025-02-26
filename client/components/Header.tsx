import { AppBar, Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

const cookie = require("cookie");

function Header() {
	const router = useRouter();

	const [isTight, setIsTight] = useState(false);

	const [user, setUser] = useState<any>(null);

	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("cs-CZ"));

	useEffect(() => {
		// Tato funkce se zavolá při každé změně cookies
		const checkUserCookie = () => {
			const cookies = cookie.parse(document.cookie);
			const userEmail = cookies.userEmail || null; // Retrieve the userEmail cookie if available

			if (userEmail) {
				setUser(userEmail);
			}
		};

		checkUserCookie(); // Zavoláme ihned po mountu

		// Sledování změn cookies každých 10ms
		const interval = setInterval(checkUserCookie, 10);
		return () => clearInterval(interval); // Po odpojení komponenty zastavíme interval
	}, []);

	useEffect(() => {
		const tightPages = ["/communication"];
		setIsTight(!tightPages.includes(router.pathname));
	}, [router.pathname]);

	useEffect(() => {


		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString("cs-CZ"));
		}, 1000);

		return () => clearInterval(interval);
	});

	const handleLogout = () => {
		document.cookie = "userEmail=; max-age=0; path=/"; // Vymazání cookie
		setUser(null);
		router.push("/");
	};

	return (
		<>
			<AppBar className="bg-transparent shadow-none text-center relative h-24">
				<Box className=" bg-d-blue flex justify-center">
					<Box className="flex items-center w-full max-w-content">
						{user && (
							<Box className="flex-1 text-left  w-1/3">
								<Typography variant="h4"> {currentTime} </Typography>
							</Box>
						)}

						<Box className="flex-2 text-center w-1/3">
							<Typography
								variant="h3"
								component="h1">
								KlikFit
							</Typography>
						</Box>

						{user && (
							<Box className="flex-1 text-right w-1/3 ">
								<Box>
									<Button
										onClick={handleLogout}
										className="text-white"
										size="small">
										Odhlásit se
									</Button>
								</Box>
								<Button
									className="text-white"
									size="small">
									Nastavení
								</Button>
							</Box>
						)}
					</Box>
				</Box>

				{user && <Navigation isTight={isTight} />}
			</AppBar>
		</>
	);
}

export default Header;
