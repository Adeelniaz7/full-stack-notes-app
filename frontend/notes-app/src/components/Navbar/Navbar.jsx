import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from "react-router-dom";
import Searchbar from '../Searchbar/Searchbar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }

  return (
    <div className='sticky top-0 z-50 glass-card flex items-center justify-between px-8 py-3 mb-6'>
      <div className='flex-1'>
        <h2 className='text-2xl font-bold text-slate-800 tracking-tight'>
          Zen<span className="text-indigo-600">Notes</span>
        </h2>
      </div>

      <div className='flex-1 flex justify-center'>
        <Searchbar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      </div>

      <div className='flex-1 flex justify-end'>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  )
}

export default Navbar
