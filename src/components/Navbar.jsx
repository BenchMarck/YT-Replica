import { Menu, MenuItem } from "@mui/material";
import { IconButton, Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { SearchBar } from "./";
import Loader from "./Loader";
import { useAuth } from "../auth/AuthContext";
import { logout } from "../config/firebase";

const Navbar = ({ toggleCategories, feedPage = false, hidden = false }) => {
  const { user, loading, profile } = useAuth() || {};

  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = useState(null);

  if (loading) return <Loader />;

  return (
    <header className="sticky top-0 z-10 bg-red-700 shadow-md">
      <div
        className={
          hidden
            ? "opacity-0 pointer-events-none h-0 overflow-hidden"
            : "opacity-100 h-auto"
        }
      >
        <div className="flex flex-wrap items-center justify-between px-4 py-2">
          {/* LEFT: Menu + Logo */}
          <div className="flex items-center gap-1 shrink-0">
            {feedPage && (
              <IconButton onClick={toggleCategories} style={{ color: "white" }}>
                <MenuIcon />
              </IconButton>
            )}

            <Link to="/" className="flex items-center">
              <img src="/iconyt1.png" alt="logo" className="w-10 h-10" />
              <span
                className="hidden md:inline-block ml-2"
                style={{ color: "white", fontSize: "1.2rem", fontWeight: 600 }}
              >
                {" "}
                YouTube
              </span>
            </Link>
          </div>

          {/* CENTER: Search bar */}
          <div className="flex-1 flex justify-center px-4 w-full max-w-xs sm:max-w-md min-w-0">
            <SearchBar />
          </div>

          {/* RIGHT: Avatar or Login/Signup */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <Tooltip title="Abrir menú">
                  <Avatar
                    src={profile?.avatarUrl || user?.photoURL}
                    alt="User"
                    onClick={(e) => setAnchorElement(e.currentTarget)}
                    className="w-10 h-10 cursor-pointer border-2 border-black hover:border-white hover:bg-red-700 transition"
                  />
                </Tooltip>

                <Menu
                  anchorEl={anchorElement}
                  open={Boolean(anchorElement)}
                  onClose={() => setAnchorElement(null)}
                >
                  <div className="px-4 py-2 text-red-600 font-semibold">
                    {user?.displayName || profile?.username}
                  </div>

                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      setAnchorElement(null);
                    }}
                  >
                    Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      logout();
                      setAnchorElement(null);
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <button className="px-4 py-1.5 bg-white text-black border border-gray-300 rounded-md font-semibold hover:bg-gray-100 transition">
                    Login
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="px-4 py-1.5 border border-white text-white rounded-md font-semibold hover:bg-red-600 transition">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
