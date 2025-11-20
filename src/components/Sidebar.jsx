import React from "react";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../config/firebase";
import { useAuth } from "../auth/AuthContext";
import Loader from "./Loader";

import { categories } from "../utils/constants";
import PopUpModal from "./PopUpModal";
import { useState } from "react";

//Sidebar.jsx
const Categories = ({ selectedCategory, setSelectedCategory, showCategoryNames }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const { user, loading } = useAuth() || {};
  
  if (loading) return <Loader />;

  const loggedInUser = user?.uid ? true : false;
  //const loggedInUser = !!user;

return (
  <Stack width= {"100%"}
    direction="row"
    sx={{
      overflowY: "auto",
      height: { sx: "auto", md: "95%" },
      flexDirection: { md: "column" },
    }}
  >
    {categories.map((category) => (
      <button
        className="category-btn"
        onClick={() => setSelectedCategory(category.name)}
        style={{
          background: category.name === selectedCategory && "#FC1503",
          color: "white",
        }}
        key={category.name}
      >
        <span
          className={`icon-span ${ category.name === "Red Bull" ? "music-icon" : ""}
          ${selectedCategory === "Red Bull" && category.name === "Red Bull" ? "selected" : ""}`}
          style={{ borderRadius: "20%",
          color: category.name === selectedCategory ? "white" : "red", marginRight: showCategoryNames ? "15px" : 0 }}>
          {category.icon}
        </span>
        <span style={{ opacity: category.name === selectedCategory ? "1" : "0.8" }} className={showCategoryNames ? "" : "hidden"} >
          {category.name}
        </span>
      </button>
    ))}
    <button className= 'w-full  text-white font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer mt-4 hover:opacity-75 hover:bg-[#333333] hover:border-2 hover:border-indigo-600 hover:text-red-600'
    onClick={ () => {loggedInUser ? navigate("/profile") : setShowModal(true)}}
    > { showCategoryNames ? <span >Perfil</span> : <span >👤</span>}
      <span className='ml-2'>&#8594;</span>
    </button>
      {showModal && <PopUpModal closingModal={() => setShowModal(false)} />}
    <button
    className='w-full bg-red-600 text-black font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer mt-4 hover:bg-white hover:text-red-600'
    onClick={() => {loggedInUser ? logout() : navigate("/login")}}>
      {showCategoryNames ? (loggedInUser ? "Salir 🚪" : "Entrar 🔑") : (loggedInUser ? "👋" : "🔑")}
    </button>
  </Stack>
  );
};

export default Categories;
