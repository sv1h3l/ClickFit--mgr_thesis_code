import React, { useEffect, useState } from "react";
import { AppBar, Box, Button, Typography } from "@mui/material";
import Navigation from "./Navigation";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("cs-CZ")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("cs-CZ"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          className="px-6 bg-d-blue"
        >
          {user && (
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography variant="h4"> {currentTime} </Typography>
            </Box>
          )}

          <Box sx={{ flex: 2, textAlign: "center" }}>
            <Typography variant="h3" component="h1">
              {" "}
              KlikFit{" "}
            </Typography>
          </Box>

          {user && (
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Box>
                <Button
                  onClick={handleLogout}
                  className="text-white"
                  size="small"
                >
                  Odhlásit se
                </Button>
              </Box>
              <Button className="text-white" size="small">
                Nastavení
              </Button>
            </Box>
          )}
        </Box>
        {user && <Navigation />}
      </AppBar>
    </>
  );
}

export default Header;
