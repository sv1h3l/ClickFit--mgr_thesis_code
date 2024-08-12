import React from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import PersonalAndHealthData from "@/components/PersonalAndHealthData";
import SportData from "@/components/SportData";
import { Box, Typography } from "@mui/material";
import Sports from "@/components/Sports";
import Exercises from "@/components/Exercises";
import ExerciseInformation from "@/components/ExerciseInformation";

function ExercisesDatabase() {
  return (
    <>
      <Head>
        <title>Databáze cviků - KlikFit</title>
      </Head>

      <Layout>
        <Box component="div" className="flex justify-center">
          <Box
            component="div"
            className="flex justify-center items-center h-screen"
          >
            <Sports />

            <Exercises />

            <ExerciseInformation />
          </Box>
        </Box>
      </Layout>
    </>
  );
}

export default ExercisesDatabase;
