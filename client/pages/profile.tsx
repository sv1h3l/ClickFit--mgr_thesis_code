import PersonalAndHealthData from "@/components/PersonalAndHealthData";
import WideTwoColumnsPage from "@/components/WideTwoColumnsPage";
import Head from "next/head";
import Layout from "../components/Layout";
import SportData from "@/components/SportData";

function Profile() {
	return (
		<>
			<Head>
				<title>Profil - KlikFit</title>
			</Head>

			<Layout>
				<WideTwoColumnsPage
					setColumnsSameWidth={true}
					firstColumnChildren={<PersonalAndHealthData></PersonalAndHealthData>}
					secondColumnChildren={<SportData />}
				/>
			</Layout>
		</>
	);
}

export default Profile;
