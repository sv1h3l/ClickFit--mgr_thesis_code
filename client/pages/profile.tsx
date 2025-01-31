import PersonalAndHealthData from "@/components/PersonalAndHealthData";
import SportData from "@/components/SportData";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import Head from "next/head";
import Layout from "../components/Layout";
import GeneralCard from "@/components/GeneralCard";

function Profile() {
    return (
        <>
            <Head>
                <title>Profil - KlikFit</title>
            </Head>

            <Layout>
                <TwoColumnsPage
                    firstColumnChildren={<PersonalAndHealthData></PersonalAndHealthData>}
                    secondColumnChildren={<SportData fullHeight />}
                />
            </Layout>
        </>
    );
}

export default Profile;
