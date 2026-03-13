import React from 'react'
import {FaMagnifyingGlass} from "react-icons/fa6";
import {IoMdClose} from "react-icons/io";

const Searchbar = ({value,onChange,handleSearch,onClearSearch}) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100/50 border border-slate-200/50 rounded-2xl transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:w-96">
      <input
        type="text"
        placeholder="Search Notes..."
        className="w-full text-xs bg-transparent py-3 outline-none text-slate-700"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-red-500 transition-colors mr-3"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors"
        onClick={handleSearch}
      />
    </div>
  );
  
}

export default Searchbar
