import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from "react-icons/md";
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose,showToastMessage }) => {

  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully")
        getAllNotes();
        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  };

  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/edit-Note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated successfully")
        getAllNotes();
        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please Enter the title");
      return;
    }
    if (!content) {
      setError("Please Enter the content");
      return;
    }
    setError("");

    if (type === 'edit') {
      editNote()
    } else {
      addNewNote();
    }
  }

  return (
    <div className='relative p-2'>
      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center absolute -top-2 -right-2 hover:bg-rose-50 group transition-colors"
        onClick={onClose}
      >
        <MdClose className="text-2xl text-slate-400 group-hover:text-rose-500 transition-colors" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-900 font-semibold outline-none bg-indigo-50/30 p-3 rounded-xl border border-transparent focus:border-indigo-100 transition-all placeholder:text-slate-300"
          placeholder="What's on your mind?"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-6'>
        <label className="input-label">Content</label>
        <textarea
          className="text-sm text-slate-700 outline-none bg-slate-50/50 p-4 rounded-xl border border-slate-100 focus:border-indigo-100 focus:bg-white transition-all placeholder:text-slate-300"
          placeholder="Start typing your note here..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-6">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs font-medium pt-4 animate-pulse">{error}</p>}

      <button 
        className="btn-primary font-bold mt-8 py-4 uppercase tracking-widest" 
        onClick={handleAddNote}
      >
        {type === "edit" ? "Update Note" : "Save Note"}
      </button>
    </div>
  )
}

export default AddEditNotes
