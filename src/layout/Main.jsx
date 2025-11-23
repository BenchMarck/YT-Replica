import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "../components";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdvancedSearchPanel from "../components/AdvancedSearchPanel";

export default function Main() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const keepExpanded = location.pathname.startsWith("/search-advanced");
  useEffect(() => {
    if (!keepExpanded) setExpanded(false);
  }, [location.pathname]);

  const [showCategoryNames, setShowCategoryNames] = useState(true);
  const toggleCategories = () => setShowCategoryNames((prev) => !prev);

  const isFeedPage = location.pathname === "/";
  const hidePanel = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar
        toggleCategories={toggleCategories}
        feedPage={isFeedPage}
        hidden={hidePanel}
      />
      <div style={{ display: hidePanel ? "none" : "block" }}>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded((prev) => !prev)}
          disableGutters
          sx={{ backgroundColor: "#656a67ff", zIndex: 5, position: "relative" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Búsqueda Avanzada
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#c5c8caff" }}>
            <AdvancedSearchPanel />
          </AccordionDetails>
        </Accordion>
      </div>
      <Outlet context={{ showCategoryNames }} />
    </div>
  );
}
