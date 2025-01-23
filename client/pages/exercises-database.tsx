import ExerciseInformation from "@/components/ExerciseInformation";
import Exercises from "@/components/Exercises";
import Sports from "@/components/Sports";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import Head from "next/head";
import Layout from "../components/Layout";

function ExercisesDatabase() {
	return (
		<>
			<Head>
				<title>Databáze cviků - KlikFit</title>
			</Head>

			<Layout>
				{
					<TwoColumnsPage
						firstColumnWidth="w-1/3"
						secondColumnWidth="w-2/3"
						firstColumnChildren={
							<>
								<Sports />

								<Exercises />
							</>
						}
						secondColumnChildren={<ExerciseInformation />}
					/>

					/*<Box
						component="div"
						className="flex justify-center">
						<Box
							component="div"
							className="flex justify-center items-center h-screen">
							<Sports />

							<Exercises />

							<ExerciseInformation />
						</Box>
					</Box>*/
				}
			</Layout>
		</>
	);
}

export default ExercisesDatabase;
