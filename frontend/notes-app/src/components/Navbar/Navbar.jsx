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
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <div className='flex-1 text-left'>
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
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
