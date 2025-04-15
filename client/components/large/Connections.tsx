import { ConnectedUser } from "@/pages/connection";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import GeneralCard from "./GeneralCard";

interface Props {
	connectedUsers: StateAndSetFunction<ConnectedUser[]>;
}

const Connections = (props: Props) => {
	const router = useRouter();

	const handleClick = (connectionId: number) => {
		console.log(connectionId);

		router.push(`/chat?connectionId=${connectionId}`);
	};

	return (
		<GeneralCard
			firstTitle="Spojení"
			height="h-full"
			firstChildren={
				<Box>
					{props.connectedUsers.state.map((user) => (
						<Typography
							key={user.connectionId}
							sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
							onClick={() => handleClick(user.connectionId)}>
							{user.connectedUserFirstName + " " + user.connectedUserLastName}
						</Typography>
					))}
				</Box>
			}
		/>
	);
};

export default Connections;
