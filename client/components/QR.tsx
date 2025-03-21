import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";
import { Button, CardContent, IconButton, Typography } from "@mui/material";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { Height } from "@mui/icons-material";

function QR() {
  return (
    <div className="flex flex-col items-center space-y-0">
      <GeneralCard firstTitle="QR kód pro navázání spojení">
        <CardContent>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="300px"
            viewBox="0 0 24 24"
            width="300px"
            fill="#000000"
          >
            <g>
              <rect fill="none" height="24" width="24" />
            </g>
            <path d="M15,21h-2v-2h2V21z M13,14h-2v5h2V14z M21,12h-2v4h2V12z M19,10h-2v2h2V10z M7,12H5v2h2V12z M5,10H3v2h2V10z M12,5h2V3h-2V5 z M4.5,4.5v3h3v-3H4.5z M9,9H3V3h6V9z M4.5,16.5v3h3v-3H4.5z M9,21H3v-6h6V21z M16.5,4.5v3h3v-3H16.5z M21,9h-6V3h6V9z M19,19v-3 l-4,0v2h2v3h4v-2H19z M17,12l-4,0v2h4V12z M13,10H7v2h2v2h2v-2h2V10z M14,9V7h-2V5h-2v4L14,9z M6.75,5.25h-1.5v1.5h1.5V5.25z M6.75,17.25h-1.5v1.5h1.5V17.25z M18.75,5.25h-1.5v1.5h1.5V5.25z" />
          </svg>
        </CardContent>
      </GeneralCard>

      <Button variant="contained" className="mt-0">Navázat spojení</Button>
    </div>
  );
}

export default QR;
