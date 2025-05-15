import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const cookie = require("cookie");

interface Props {
	externalClicked: StateAndSet<boolean>;
}

const SectionSwitcher = (props: Props) => {
	const router = useRouter();

	const context = useAppContext();

	const [actualPageId, setActualPageId] = useState<number>(1);

	const pages = [
		{
			id: 1,
			path: "/training-plans",
			firstSectionFirstLabel: "Tréninky | Nový trénink",
			firstSectionSecondLabel: "Tréninky | Nový trénink",
			secondSectionFirstLabel: "Nový trénink",
			secondSectionSecondLabel: "Nový trénink",
		},
		{
			id: 2,
			path: "/training-plan",
			firstSectionFirstLabel: "Tréninky",
			firstSectionSecondLabel: "Tréninky | Nový trénink",
			secondSectionFirstLabels: "",
			secondSectionSecondLabels: "Nový trénink",
		},
		{
			id: 3,
			path: "/diary",
			firstSectionFirstLabel: "Tréninky",
			firstSectionSecondLabel: "Tréninky | Nový trénink",
			secondSectionFirstLabels: "",
			secondSectionSecondLabels: "Nový trénink",
		},
		{
			id: 4,
			path: "/sports",
			firstSectionFirstLabel: "Tréninky",
			firstSectionSecondLabel: "Tréninky | Nový trénink",
			secondSectionFirstLabels: "",
			secondSectionSecondLabels: "Nový trénink",
		},
		{
			id: 5,
			path: "/connection",
			firstSectionFirstLabel: "Tréninky",
			firstSectionSecondLabel: "Tréninky | Nový trénink",
			secondSectionFirstLabels: "",
			secondSectionSecondLabels: "Nový trénink",
		},
		{
			id: 6,
			path: "/profile",
			firstSectionFirstLabel: "Tréninky",
			firstSectionSecondLabel: "Tréninky | Nový trénink",
			secondSectionFirstLabels: "",
			secondSectionSecondLabels: "Nový trénink",
		},
	];

	const getPage = (id: number) => {
		return pages.find((page) => page.id === id);
	};

	useEffect(() => {
		setActualPageId(pages.find((page) => page.path === router.pathname)?.id || 0);
	}, [router.pathname]);

	return (
		<Toolbar className="min-h-0 px-0 w-full ">
			<Box
				className={`w-full rounded-br-3xl rounded-tl-3xl  flex  shadow-md border-[3px]
							${context.bgTertiaryColor} ${context.borderTertiaryColor}`}>
				<Box className="flex justify-center w-full">
					<Box className="w-1/2">
						<Button
							onClick={() => {
								if (context.activeSection === 2) {
									context.setActiveSection(1);
								}
							}}
							className="h-[2.7rem] normal-case hover:bg-transparent hover:border-transparent "
							disableRipple>
							<Typography className={`text-[1.3rem] font-audiowide tracking-wide transition-all duration-300 ease-in-out  rounded-xl pl-2 pr-3 text-nowrap`}>{getPage(actualPageId)?.firstSectionFirstLabel}</Typography>
						</Button>
					</Box>

					<Box className="w-1/2">
						<Button
							onClick={() => {
								if (context.activeSection === 1) {
									context.setActiveSection(2);
								}
							}}
							className="h-[2.7rem] normal-case hover:bg-transparent hover:border-transparent"
							disableRipple>
							<Typography className={`text-[1.3rem] font-audiowide tracking-wide transition-all duration-300 ease-in-out  rounded-xl pl-2 pr-3 text-nowrap`}>{getPage(actualPageId)?.secondSectionFirstLabels}</Typography>
						</Button>
					</Box>
				</Box>
			</Box>
		</Toolbar>
	);
};

export default SectionSwitcher;
