import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import '../assets/styles/SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Product Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button className="search-icon" onClick={() => {}}>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;