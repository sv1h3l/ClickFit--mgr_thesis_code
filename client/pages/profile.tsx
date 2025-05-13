import { getAllUserAtrsReq, User } from "@/api/get/getAllUserAtrsReq";
import { getAllVisitedUserAtrsReq } from "@/api/get/getAllVisitedUserAtrsReq";
import { getDifficultiesReq } from "@/api/get/getDifficultiesReq";
import { getSportDetailLabsAndValsReq } from "@/api/get/getSportDetailLabsAndValsReq";
import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import { getVisitedUserSportDetailLabsAndValsReq } from "@/api/get/getVisitedUserSportDetailLabsAndValsReq";
import { getVisitedUserSportsReq } from "@/api/get/getVisitedUserSportsReq";
import AllSportDetails, { SportDetailLabAndVal } from "@/components/large/AllSportsAndHealthData";
import PersonalData from "@/components/large/PersonalData";
import { SportDifficulty } from "@/components/large/SportDescriptionAndSettings";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";

const cookie = require("cookie");

interface Props {
	sportsData: Sport[];
	sportDetails: { sportId: number; sportName: string; sportDetails: SportDetailLabAndVal[] }[];
	sportDifficulties: { sportId: number; sportDifficulties: SportDifficulty[] }[];
	user: User;

	cannotEdit?: boolean;
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
					<PersonalData
						cannotEdit={props.cannotEdit}
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
						user={props.user}
						sportsData={props.sportsData}
						sportDetails={props.sportDetails}
						sportDifficulties={props.sportDifficulties}
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
		return { props: { sportDetails: [], sportData: [], sportDifficulties: [], user: null } };
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");

		const visitedUserId = cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1;
		const authToken = cookies.authToken || null;

		if (visitedUserId > 0) {
			const resUser = await getAllVisitedUserAtrsReq({ authToken, visitedUserId });

			const resSports = await getVisitedUserSportsReq({ authToken, visitedUserId });

			const sportDetails = resSports.data
				? await Promise.all(
						resSports.data.map(async (sport) => {
							const resLabsAndVals = await getVisitedUserSportDetailLabsAndValsReq({ sportId: sport.sportId, authToken, visitedUserId });

							return {
								sportId: sport.sportId,
								sportName: sport.sportName,
								sportDetails: resLabsAndVals.data,
							};
						})
				  )
				: [];

			const sportDifficulties = resSports.data
				? await Promise.all(
						resSports.data.map(async (sport) => {
							const resDifficulties = await getDifficultiesReq({ sportId: sport.sportId, authToken });

							return {
								sportId: sport.sportId,
								sportDifficulties: resDifficulties.data,
							};
						})
				  )
				: [];

			return { props: { sportsData: resSports.data, user: resUser.data, sportDetails, sportDifficulties, cannotEdit: true } };
		}

		const resSports = await getSportsReq({ authToken });

		const resUser = await getAllUserAtrsReq({ authToken });

		if (resSports.status !== 200) {
			return handleError(resSports.message);
		} else if (resUser.status !== 200) {
			return handleError(resUser.message);
		}

		const sportDetails = resSports.data
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

		const sportDifficulties = resSports.data
			? await Promise.all(
					resSports.data.map(async (sport) => {
						const resDifficulties = await getDifficultiesReq({ sportId: sport.sportId, authToken });

						return {
							sportId: sport.sportId,
							sportDifficulties: resDifficulties.data,
						};
					})
			  )
			: [];

		return { props: { sportsData: resSports.data, sportDetails, sportDifficulties, user: resUser.data } };
	} catch (error) {
		return handleError(error);
	}
};
