import { Box, Button, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

function Navigation({ isWide }: { isWide?: boolean }) {
	const router = useRouter();
	const navRef = useRef<HTMLDivElement | null>(null); // Typ HTML elementu
	const [hasNavBorder, setHasNavBorder] = useState(false); // Použij stav se setterem

	const pages = new Map<string, string>([
		["training-plans", "Tréninkové plány"],
		["training-plan-predisposition", "Tvorba tréninku"],
		["exercises-database", "Databáze cviků"],
		["communication", "Komunikace"],
		["profile", "Profil"],
	]);

	function navigate(link: string) {
		router.push(`/${link}`);
	}

	useEffect(() => {
		if (navRef.current) {
			const navWidth = navRef.current.getBoundingClientRect().width;
			if (navWidth > 1750) {
				setHasNavBorder(true);
			}
		}
	}, []);

	return (
		<Toolbar className=" justify-center min-h-0 p-0">
			<Box
				ref={navRef}
				className={`w-full max-w-content ${isWide ? "max-content:px-[2px]" : "bg-white border-x-2 border-gray-200"}`}>
				<Box className="rounded-b-full bg-m-blue shadow-md flex">
					{Array.from(pages.entries()).map(([key, value], index) => (
						<Box
							key={index}
							className="w-1/5">
							<Button
								onClick={() => navigate(key)}
								className="text-black font-normal h-9 normal-case"
								size="large">
								{value}
							</Button>
						</Box>
					))}
				</Box>
			</Box>
		</Toolbar>
	);
}

export default Navigation;
