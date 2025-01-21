import { AppBar, Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

function Header({ isWide }: { isWide?: boolean }) {
	const router = useRouter();

	const [user, setUser] = useState<any>(null);

	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("cs-CZ"));

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString("cs-CZ"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
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

				{user && <Navigation isWide={isWide}/>}
			</AppBar>
		</>
	);
}

export default Header;
