import { Button, Toolbar } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";

function Navigation() {
  const router = useRouter();
  const pages = new Map<string, string>([
    ["training-plans", "Tréninkové plány"],
    ["trainings-creation", "Tvorba tréninků"],
    ["exercises-database", "Databáze cviků"],
    ["communication", "Komunikace"],
    ["profile", "Profil"],
  ]);

  function navigate(link: string) {
    router.push(`/${link}`);
  }

  return (
    <Toolbar className="flex w-full rounded-b-full bg-m-blue h-8 min-h-8 shadow-md">
      {Array.from(pages.entries()).map(([key, value], index) => (
        <Button
          key={index}
          onClick={() => navigate(key)}
          className="text-black mx-auto text-sm w-1/5"
          size="small"
        >
          {value}
        </Button>
      ))}
    </Toolbar>
  );
}

export default Navigation;
