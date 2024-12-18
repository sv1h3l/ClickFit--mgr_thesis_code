import React, { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import GeneralCard from "@/components/GeneralCard";
import Typography from "@mui/material/Typography";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import Connections from "@/components/Connections";
import QR from "@/components/QR";

function Communication() {
  return (
    <>
      <Head>
        <title>Komunikace - KlikFit</title>
      </Head>

      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Connections>
            <Typography>Josef Štěpán</Typography>
            <Typography>Bronislav Sobotka</Typography>
            <Typography>Karel Nedvěd</Typography>
            <Typography>Karel Medvěd</Typography>
            <Typography>Petr Kam</Typography>
            <Typography>Ralph Lauren</Typography>
            <Typography>Jakub Vlček</Typography>
          </Connections>

          <QR />
        </div>
      </Layout>
    </>
  );
}

export default Communication;
