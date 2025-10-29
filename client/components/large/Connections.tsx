import { ConnectedUser } from "@/pages/connection";
import { useAppContext } from "@/utilities/Context";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Badge, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ButtonComp from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import LabelAndValue from "../small/LabelAndValue";

const cookie = require("cookie");

interface Props {
	connectedUsers: StateAndSetFunction<ConnectedUser[]>;

	modalCode?: number | null;
	connectionString?: string | null;
}

const Connections = (props: Props) => {
	const context = useAppContext();

	const router = useRouter();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalCode, setModalCode] = useState(0);
	const [connectionString, setConnectionString] = useState("");

	useEffect(() => {
		if (props.modalCode) {
			setModalCode(props.modalCode || 0);

			if (props.modalCode === 2 && props.connectionString) {
				const formattedCode = props.connectionString.replace(/(\d{4})(?=\d)/g, "$1 - ");
				setConnectionString(formattedCode);
			} else setConnectionString(props.connectionString || "");

			setIsModalOpen(true);

			document.cookie = "cc=; path=/; max-age=0;";
			document.cookie = "cc-mod-opened=; path=/; max-age=0;";
		}
	}, []);

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

			{context.isSmallDevice ? (
				<CustomModal
					isOpen={isModalOpen}
					title={modalCode < 2 ? "Nové spojení navázáno" : "Nové spojení nenavázáno"}
					hideBackButton
					style="max-w-lg w-full px-4"
					children={
						<Box className=" mb-4 max-w-md px-4">
							<Typography className="">
								{modalCode === 1
									? `Spojení s uživatelem ${connectionString} je úspěšně navázáno.`
									: modalCode === 2
									? `Uživatel s kódem ${connectionString} neexistuje.`
									: modalCode === 3
									? "Nelze navázat spojení sám se sebou."
									: modalCode === 4
									? `Spojení s uživatelem ${connectionString} je již navázáno.`
									: `Kód musí být 12ciferné číslo.`}
							</Typography>

							<ButtonComp
								style="mx-auto mt-9"
								size="medium"
								content={"Pokračovat"}
								onClick={() => {
									setIsModalOpen(false);
								}}
							/>
						</Box>
					}
				/>
			) : null}
		</Box>
	);
};

export default Connections;
