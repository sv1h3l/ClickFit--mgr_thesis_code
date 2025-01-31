import React from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import Sports from "@/components/Sports";
import SportData from "@/components/SportData";
import GeneralCard from "@/components/GeneralCard";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import router from "next/router";
import { Typography } from "@mui/material";

function TrainingsCreation() {
    return (
        <>
            <Head>
                <title>Tvorba tréninku - KlikFit</title>
            </Head>

            <Layout>
                {
                    <TwoColumnsPage
                        firstColumnWidth="w-1/3"
                        secondColumnWidth="w-2/3"
                        firstColumnChildren={<Sports fullHeight />}
                        secondColumnChildren={
                            <>
                                <SportData />

                                <GeneralCard height="h-1/6">
                                    <Box className="flex">
                                        <Box className="w-1/2 flex flex-col items-center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    router.push("/training-plan-creation");
                                                }}
                                            >
                                                Manuální tvorba
                                            </Button>
                                            <Typography className="pt-4 font-light">Sportovní údaje, které je nutno vyplnit pro manuální tvorbu.</Typography>
                                        </Box>

                                        <Box className="w-1/2 flex flex-col items-center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    router.push("/training-plan-creation");
                                                }}
                                            >
                                                Automatická tvorba
                                            </Button>
                                            <Typography className="pt-4 font-light">Sportovní údaje, které je nutno vyplnit pro automatickou tvorbu.</Typography>

                                        </Box>
                                    </Box>
                                </GeneralCard>
                            </>
                        }
                    />
                }
            </Layout>
        </>
    );
}

export default TrainingsCreation;
