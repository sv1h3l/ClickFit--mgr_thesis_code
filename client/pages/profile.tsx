import PersonalAndHealthData from "@/components/PersonalAndHealthData";
import SportData from "@/components/SportData";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import Head from "next/head";

function Profile() {
	return (
		<>
			<Head>
				<title>Profil - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnChildren={<PersonalAndHealthData></PersonalAndHealthData>}
				secondColumnChildren={<SportData fullHeight />}
			/>
		</>
	);
}

export default Profile;
