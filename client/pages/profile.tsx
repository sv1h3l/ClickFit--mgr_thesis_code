import PersonalAndHealthData from "@/components/PersonalAndHealthData";
import SportData from "@/components/SportData";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import Head from "next/head";
import Layout from "../components/Layout";

function Profile() {
	return (
		<>
			<Head>
				<title>Profil - KlikFit</title>
			</Head>

			<Layout>
				<TwoColumnsPage
					firstColumnChildren={<PersonalAndHealthData></PersonalAndHealthData>}
					secondColumnChildren={<SportData />}
				/>
			</Layout>
		</>
	);
}

export default Profile;
