import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import { Navbar } from "../components";

export default function Main() {
  const [showCategoryNames, setShowCategoryNames] = useState(true);
  const toggleCategories = () => setShowCategoryNames((prev) => !prev);

  const location = useLocation();
  const isFeedPage = location.pathname === "/";

  return (
    <Box sx={{ backgroundColor: "#000" /*minHeight: "100vh"*/ }}>
      <Navbar toggleCategories={toggleCategories} feedPage={isFeedPage} />
      <Outlet context={{ showCategoryNames }} />
    </Box>
  );
}
