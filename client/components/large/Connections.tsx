import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { CardContent, IconButton } from "@mui/material";
import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";

interface GeneralCardProps {
	children: ReactNode;
}

function Connections({ children }: GeneralCardProps) {
	const childrenArray = React.Children.toArray(children);

	return (
		<GeneralCard
			firstTitle="Navázaná spojení"
			firstChildren={
				<CardContent>
					{React.Children.map(children, (child) => (
						<div className="py-2 flex justify-between items-center">
							{child}
							<div className="flex">
								<IconButton color="primary">
									<Person2RoundedIcon />
								</IconButton>
								<IconButton color="primary">
									<SendRoundedIcon />
								</IconButton>
							</div>
						</div>
					))}
				</CardContent>
			}></GeneralCard>
	);
}

export default Connections;
