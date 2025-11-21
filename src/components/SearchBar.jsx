import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const onhandleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <form
      onSubmit={onhandleSubmit}
      className="flex items-center w-full max-w-[600px] bg-white border border-gray-300 rounded-full
      pl-2 pr-1 shadow-sm">
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: "0.9rem",
          "& input": {
            paddingLeft: "2px",
          },
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
    </form>
  );
};

export default SearchBar;
