import { getConnectionAtrsReq } from "@/api/get/getConnectionAtrsReq";
import Connections from "@/components/large/Connections";
import NewConnection from "@/components/large/NewConnection";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { generateQRCode } from "@/components/small/QRComp";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

const cookie = require("cookie");

interface Props {
	connectionCode: number;

	qrCode: any;
}

const Connection = (props: Props) => {
	return (
		<>
			<Head>
				<title>Spojení - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-1/3"
				secondColumnWidth="w-1/3"
				secondColumnHeight="h-fit"
				firstColumnChildren={<Connections />}
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

		const response = await getConnectionAtrsReq({ authToken });

		const connectionCode = response.data?.connectionCode;

		if (response.status === 200 && connectionCode) {
			const qrCode = await generateQRCode(connectionCode.toString());

			return { props: { connectionCode, qrCode } };
		} else {
			return { props: { connectionCode: 0, qrCode: 0 } };
		}
	} catch (error) {
		return { props: { connectionCode: 0, qrCode: 0 } };
	}
};
