import { getAllUserAtrsReq } from "@/api/get/getAllUserAtrsReq";
import { getSportDetailLabsAndValsReq } from "@/api/get/getSportDetailLabsAndValsReq";
import { getSportsReq } from "@/api/get/getSportsReq";
import AllSportDetails, { SportDetailLabAndVal } from "@/components/large/AllSportDetails";
import PersonalAndHealthData, { User } from "@/components/large/PersonalAndHealthData";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";

const cookie = require("cookie");

interface Props {
	//sports: { sportId: number; sportName: string }[];

	sports: { sportId: number; sportName: string; sportDetails: SportDetailLabAndVal[] }[];
	user: User;
}

function Profile(props: Props) {
	const [editing, setEditing] = useState<boolean>(false);

	return (
		<>
			<Head>
				<title>Profil - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnChildren={
					<PersonalAndHealthData
						editing={{ state: editing, setState: setEditing }}
						user={props.user}
					/>
				}
				secondColumnChildren={
					<AllSportDetails
						editing={{
							state: editing,
							setState: setEditing,
						}}
						sports={props.sports}
					/>
				}
			/>
		</>
	);
}

export default Profile;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	const handleError = (error: any) => {
		console.error("Error fetching sports data:", error);
		return { props: { sports: [] } };
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		const resSports = await getSportsReq({ authToken });

		const resUser = await getAllUserAtrsReq({ authToken });

		if (resSports.status !== 200) {
			return handleError(resSports.message);
		} else if (resUser.status !== 200) {
			return handleError(resUser.message);
		}

		const sports = resSports.data
			? await Promise.all(
					resSports.data.map(async (sport) => {
						const resLabsAndVals = await getSportDetailLabsAndValsReq({ sportId: sport.sportId, authToken });

						return {
							sportId: sport.sportId,
							sportName: sport.sportName,
							sportDetails: resLabsAndVals.data,
						};
					})
			  )
			: [];

		return { props: { sports, user: resUser.data } };
	} catch (error) {
		return handleError(error);
	}
};
