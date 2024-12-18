import React, { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import Typography from "@mui/material/Typography";
import PersonalAndHealthData from "@/components/PersonalAndHealthData";
import { Box } from "@mui/material";
import SportData from "@/components/SportData";

function Profile() {
  return (
    <>
      <Head>
        <title>Profil - KlikFit</title>
      </Head>

      <Layout>
        <Box component="div" className="flex justify-center">
          <Box
            component="div"
            className="flex justify-center items-center h-screen"
          >
            <PersonalAndHealthData>
              <>
                <Typography>jakub.svihel01@upol.cz</Typography>
                <Typography>Jakub</Typography>
                <Typography>Švihel</Typography>
                <Typography>24 let</Typography>
                <Typography>177 cm</Typography>
                <Typography>84 kg</Typography>
                <Typography>muž</Typography>
              </>
            </PersonalAndHealthData>
          </Box>

          <Box
            component="div"
            className="flex justify-center items-center h-screen"
          >
            <SportData />
          </Box>
        </Box>
      </Layout>
    </>
  );
}

export default Profile;
