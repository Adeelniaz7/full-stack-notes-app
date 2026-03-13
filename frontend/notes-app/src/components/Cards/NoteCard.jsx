import moment from 'moment';
import React from 'react';
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className="glass-card rounded-2xl p-5 note-card-hover group">
      <div className='flex items-center justify-between mb-3'>
        <div className="flex-1">
          <h6 className="text-base font-semibold text-slate-800 line-clamp-1">{title}</h6>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{moment(date).format('Do MMM YYYY')}</span>
        </div>

        <MdOutlinePushPin 
          className={`text-2xl cursor-pointer transition-all duration-300 ${isPinned ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`} 
          onClick={onPinNote} 
        />
      </div>

      <p className="text-sm text-slate-600 leading-relaxed min-h-[4rem]">{content?.slice(0, 100)}{content ?.length > 100 && "..."}</p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-1">
          {tags.map((item, index) => (
            <span key={index} className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-tighter">
              #{item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <MdCreate
            className="text-xl cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors"
            onClick={onEdit}
          />
          <MdDelete
            className="text-xl cursor-pointer text-slate-400 hover:text-rose-500 transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default NoteCard
