import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ expanded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const onhandleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    }
    if (expanded) {
  setTimeout(() => {
    const el = document.getElementById("results-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 150);
}

  };

  return (
    <Paper
      component="form"
      onSubmit={onhandleSubmit}
sx={{
  display: "flex",
  alignItems: "center",
  borderRadius: 20,
  border: "1px solid #ddd",
  pl: 2,
  pr: 1,
  mr: { sm: 5 },
  width: "100%",
  maxWidth: 600,
  boxShadow: "none",
  backgroundColor: "#fff",
}}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: "0.9rem",
          "& input": {
            paddingLeft: "8px",
          },
          "& input:focus": {
            outline: "2px solid black",
            outlineOffset: "2px",
            borderRadius: "15px",
          }
        }}
        className='search-bar'
        placeholder="Buscar..."
        inputProps={{ "aria-label": "search" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton
        type="submit"
        sx={{
          p: "8px",
          color: "rgba(180, 19, 19, 1)",
          "&:hover": { color: "#ff4444" },
        }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
