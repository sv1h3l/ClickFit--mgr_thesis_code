import { createConnectionReq } from "@/api/create/createConnectionReq";
import { getConnectionAtrsReq } from "@/api/get/getConnectionAtrsReq";
import Connections from "@/components/large/Connections";
import GeneralCard from "@/components/large/GeneralCard";
import NewConnection from "@/components/large/NewConnection";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { generateQRCode } from "@/components/small/QRComp";
import { useAppContext } from "@/utilities/Context";
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
	unreadMessages: number;
}

interface Props {
	connectionCode: number;
	qrCode: string;

	connectedUsers: ConnectedUser[];

	modalCode?: number | null;
	connectionString?: string | null;
}

const Connection = (props: Props) => {
	const context = useAppContext();

	const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>(props.connectedUsers);

	return (
		<>
			<Head>
				<title>Spojení - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth={context.isSmallDevice ? "w-full" : "w-full max-w-[30rem]"}
				secondColumnWidth={context.isSmallDevice ? "w-0" : "w-full max-w-[30rem]"}
				secondColumnHeight="h-fit"
				firstColumnChildren={
					<GeneralCard
						firstTitle="Spojení"
						secondTitle={context.isSmallDevice ? "Nová spojení" : ""}
						height="h-full"
						firstChildren={<Connections connectedUsers={{ state: connectedUsers, setState: setConnectedUsers }} />}
						secondChildren={
							context.isSmallDevice ? (
								<NewConnection
									modalCode={props.modalCode}
									connectionString={props.connectionString}
									connectedUsers={{ state: connectedUsers, setState: setConnectedUsers }}
									connectionCode={props.connectionCode}
									qrCode={props.qrCode}
								/>
							) : null
						}
					/>
				}
				secondColumnChildren={
					!context.isSmallDevice ? (
						<GeneralCard
							firstTitle="Nová spojení"
							height="h-full"
							firstChildren={
								<NewConnection
									modalCode={props.modalCode}
									connectionString={props.connectionString}
									connectedUsers={{ state: connectedUsers, setState: setConnectedUsers }}
									connectionCode={props.connectionCode}
									qrCode={props.qrCode}
								/>
							}
						/>
					) : (
						<></>
					)
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

		const connectionCodeStr = context.query.cc;
		const connectionCodeNum = Number(connectionCodeStr);

		let newConnection;
		if (authToken) newConnection = await createConnectionReq({ connectionCode: connectionCodeNum, authToken });

		if (resConnectionAtrs.status === 200 && connectionCode) {
			const qrCode = await generateQRCode(connectionCode.toString());

			return {
				props: {
					connectionCode,
					qrCode,
					connectedUsers: resConnectionAtrs.data?.connectedUsers,
					modalCode:
						newConnection?.status === 200 && newConnection?.data
							? 1
							: newConnection?.status === 404
							? 2
							: newConnection?.status === 400
							? 3
							: newConnection?.status === 409 && newConnection?.data
							? 4
							: newConnection?.status === 422 && connectionCodeStr && connectionCodeStr?.length > 0
							? 5
							: null,
					connectionString:
						(newConnection?.status === 200 || newConnection?.status === 409) && newConnection?.data
							? newConnection.data.connectedUserFirstName + " " + newConnection.data.connectedUserLastName
							: newConnection?.status === 404
							? connectionCodeStr
							: newConnection?.status === 400 || (newConnection?.status === 422 && connectionCodeStr && connectionCodeStr?.length > 0)
							? ""
							: null,
				},
			};
		} else {
			return { props: { connectionCode: 0, qrCode: 0, connectedUsers: [] } };
		}
	} catch (error) {
		return { props: { connectionCode: 0, qrCode: 0, connectedUsers: [] } };
	}
};
