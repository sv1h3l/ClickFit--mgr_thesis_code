import { ConnectedUser } from "@/pages/connection";
import { useAppContext } from "@/utilities/Context";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Badge, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import LabelAndValue from "../small/LabelAndValue";

const cookie = require("cookie");

interface Props {
	connectedUsers: StateAndSetFunction<ConnectedUser[]>;
}

const Connections = (props: Props) => {
	const context = useAppContext();

	const router = useRouter();

	const handleClick = (connectionId: number) => {
		document.cookie = cookie.serialize("chat_ci", connectionId, {
			path: "/",
			maxAge: 60 * 60 * 24,
		});

		router.push(`/chat`);
	};

	return (
		<Box className="mt-1">
			{props.connectedUsers.state.length < 1 ? (
				<Typography className="mt-2 ml-1 text-lg font-light">Žádné spojení zatím nebylo navázáno.</Typography>
			) : (
				props.connectedUsers.state.map((user) => (
					<Box className="w-fit mb-4 -ml-1 group ">
						<Badge
							className={``}
							badgeContent={user.unreadMessages}
							max={99}
							onClick={() => handleClick(user.connectionId)}
							invisible={user.unreadMessages < 1}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							sx={{
								"& .MuiBadge-badge": {
									borderRadius: "0.5rem", // nebo "0.75rem", podle potřeby
								},
							}}
							slotProps={{
								badge: {
									className: ` ${context.bgQuaternaryColor + context.borderQuaternaryColor} border-2 cursor-pointer `,
								},
							}}>
							<LabelAndValue
								noPaddingTop
								firstTypographyStyle="text-lg py-2"
								//mainStyle="group-hover:bg-white"
								label={`${user.connectedUserFirstName} ${user.connectedUserLastName}`}
								onClick={() => handleClick(user.connectionId)}
							/>
						</Badge>
					</Box>
				))
			)}
		</Box>
	);
};

export default Connections;
