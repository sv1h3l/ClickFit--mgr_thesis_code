import { Box, Button, Toolbar } from "@mui/material";
import { useRouter } from "next/router";

function Navigation({ isWide }: { isWide?: boolean }) {
	const router = useRouter();
	const pages = new Map<string, string>([
		["training-plans", "Tréninkové plány"],
		["trainings-creation", "Tvorba tréninků"],
		["exercises-database", "Databáze cviků"],
		["communication", "Komunikace"],
		["profile", "Profil"],
	]);

	function navigate(link: string) {
		router.push(`/${link}`);
	}

	return (
		<Toolbar className=" justify-center min-h-0">
			<Box className={`w-full max-w-content ${!isWide && "bg-white border-x-2 border-gray-200"}`}>
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
