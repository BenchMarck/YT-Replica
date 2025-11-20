import { Menu, MenuItem } from "@mui/material";
import { Box, Stack, IconButton, Avatar } from "@mui/material";
import { Typography, Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchBar } from "./";
import Loader from "./Loader";
import { useAuth } from "../auth/AuthContext";
import { logout } from "../config/firebase";
import AdvancedSearchPanel from "./AdvancedSearchPanel";


const Navbar = ({ toggleCategories, feedPage=false }) => {
  const { user, loading, profile } = useAuth() || {};
  
  const loggedInUser = user?.uid ? true : false;
  
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const keepExpanded = location.pathname.startsWith("/search");
  useEffect(() => { if (!keepExpanded) setExpanded(false); }, [location.pathname]);
  
  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = useState(null);
  const handleMenuOpen = (event) => { setAnchorElement(event.currentTarget); };
  const handleMenuClose = () => { setAnchorElement(null); };
  
  if (loading) return <Loader />;
  
  return (
  <>
    <Stack direction="row" alignItems="center" p={1.5} sx={{
      position: "sticky",
      background: "rgba(180, 19, 19, 1)",
      top: 0,
      zIndex: 1000,
      justifyContent: "space-between",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    }}
    >
      {/* Left Section - Logo + Menu */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        { feedPage ? (
          <IconButton sx={{ color: "white" }} onClick={toggleCategories}>
            <MenuIcon />
          </IconButton>
        ) : null }
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/iconyt1.png" alt="logo" width={45} height={45} />
          <span style={{ color: "white", fontSize: "1.2rem", fontWeight: 600, marginLeft: "8px", }}>
            YouTube
          </span>
        </Link>
      </Stack>

      {/* Center Section - Search Bar */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <SearchBar expanded={expanded} />
      </Box>

      {/* Right Section - User Avatar */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {loggedInUser ? (
          <>
        <Tooltip title="Open settings">
            <Avatar onClick={handleMenuOpen}
              src={profile?.avatarUrl || user?.photoURL}
              alt="User"
              sx={{ width: 38, height: 38, border: "2px solid black", cursor: "pointer",
                ":hover": { background: "rgba(180, 19, 19, 1)",border: "2px solid white" }
              }}
            />
          </Tooltip>
          <Menu
            anchorEl={anchorElement}
            open={Boolean(anchorElement)}
            onClose={handleMenuClose}
            slotProps={{ sx: { mt: 1, minWidth: 150, }, }}
          >
            <span style={{ color: "red", fontSize: "1.1rem", fontWeight: 600, margin: "10px", }}>
              {user?.displayName || profile?.username}
            </span>
            <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
              Logout
            </MenuItem>
          </Menu>
        </>
        ) : (
          <div className="flex">

          <Link to="/login" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <button
              style={{
                color: "black",
                backgroundColor: "white",
                fontSize: "1.2rem",
                fontWeight: 600,
                marginLeft: "8px",
                border: "1px solid white",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
              >
              Login
            </button>
          </Link>

          <Link to="/signup" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <button
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: 600,
                marginLeft: "8px",
                border: "1px solid white",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
              >
              Sign Up
            </button>
          </Link>
              </div>
        )}
      </Stack>
    </Stack>
    <Accordion expanded={expanded} onChange={() => setExpanded(prev => !prev)}
    disableGutters sx={{ backgroundColor: "#656a67ff", zIndex: 1, position: "relative" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Búsqueda Avanzada
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: "#c5c8caff" }}>
        <AdvancedSearchPanel />
      </AccordionDetails>
    </Accordion>
  </>
  );
}

export default Navbar;
