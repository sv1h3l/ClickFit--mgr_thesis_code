import { Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

function Navigation() {
	const router = useRouter();

	const pages = new Map<string, string>([
		["training-plans", "Tréninky"],
		["diary", "Deník"],
		["sports-and-exercises", "Sporty"], // FIXME opravit odkaz
		["communication", "Komunita"],
	]);

	// Funkce pro navigaci
	function navigate(link: string) {
		router.push(`/${link}`);
	}

	return (
		<Toolbar className="min-h-0 px-0 w-full mt-[0.05rem]">
			<Box className="w-full rounded-br-3xl rounded-tl-3xl bg-navigation-color-neutral flex justify-end shadow-md border-[3px]">
				{Array.from(pages.entries()).map(([key, value], index) => {
					const isActive = router.pathname === `/${key}`;

					return (
						<Box
							key={index}
							className="flex justify-center w-1/4">
							<Button
								onClick={() => navigate(key)}
								className="h-11 normal-case"
								size="large"
								disableRipple>
								<Typography
									className={`text-[1.3rem] font-audiowide tracking-wide transition-all duration-150 ease-in-out  rounded-xl ${
										isActive ? "py-[0.1rem] px-3 bg-primary-color-neutral border-2 border-[#2d2d2d] scale-100 " : "border-transparent  scale-95"
									}`}>
									{value}
								</Typography>
							</Button>
						</Box>
					);
				})}
			</Box>
		</Toolbar>
	);
}

export default Navigation;
