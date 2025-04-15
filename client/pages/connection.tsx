import { getConnectionAtrsReq } from "@/api/get/getConnectionAtrsReq";
import Connections from "@/components/large/Connections";
import NewConnection from "@/components/large/NewConnection";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { generateQRCode } from "@/components/small/QRComp";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";

const cookie = require("cookie");

export interface ConnectedUser {
	connectionId: number;
	connectedUserId: number;

	connectedUserFirstName: string;
	connectedUserLastName: string;

	orderNumber: number;
}

interface Props {
	connectionCode: number;
	qrCode: string;

	connectedUsers: ConnectedUser[];
}

const Connection = (props: Props) => {
	const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>(props.connectedUsers);

	return (
		<>
			<Head>
				<title>Spojení - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-1/3"
				secondColumnWidth="w-1/3"
				secondColumnHeight="h-fit"
				firstColumnChildren={<Connections connectedUsers={{ state: connectedUsers, setState: setConnectedUsers }} />}
				secondColumnChildren={
					<NewConnection
						connectionCode={props.connectionCode}
						qrCode={props.qrCode}
					/>
				}
			/>
		</>
	);
};

export default Connection;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		const resConnectionAtrs = await getConnectionAtrsReq({ authToken });
		const connectionCode = resConnectionAtrs.data?.connectionCode;

		if (resConnectionAtrs.status === 200 && connectionCode) {
			const qrCode = await generateQRCode(connectionCode.toString());

			return { props: { connectionCode, qrCode, connectedUsers: resConnectionAtrs.data?.connectedUsers } };
		} else {
			return { props: { connectionCode: 0, qrCode: 0, connectedUsers: [] } };
		}
	} catch (error) {
		return { props: { connectionCode: 0, qrCode: 0, connectedUsers: [] } };
	}
};
