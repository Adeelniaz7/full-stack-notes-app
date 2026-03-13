
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from "react-icons/md"
import AddEditNotes from './AddEditNotes';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import axiosInstance from '../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/Emptycard';
import AddNoteImg from '../../assets/Images/Add-notes.svg';
import NoDataImg from '../../assets/Images/no-data.svg';

Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });


  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  }

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Get user Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setIsSearch(false);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("Unexpected error occurred.Please try again.")
    }
  };

  // Search Notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Clear Search
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Delete Notes
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-Note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted successfully", "delete")
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("Unexpected error occurred.Please try again")
      }
    }
  }

  // Update isPinned
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        isPinned: !noteData.isPinned,
      });
      if (response.data && !response.data.error) {
        showToastMessage(
          noteData.isPinned ? "Note Unpinned" : "Note Pinned",
          "add"
        );
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { }
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className="container mx-auto px-6">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 pb-20">
            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => { deleteNote(item) }}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <EmptyCard
              imgSrc={isSearch ? NoDataImg : AddNoteImg}
              message={isSearch
                ? "Oops! No notes found matching your search."
                : "Ready to capture your thoughts? Click the 'Add' button to start your journey!"
              }
            />
          </div>
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 fixed right-10 bottom-10 z-50 transition-all duration-300 transform hover:rotate-90 hover:scale-110 shadow-xl shadow-indigo-200"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          },
        }}
        contentLabel=""
        className="w-[90%] md:w-[60%] lg:w-[40%] max-h-3/4 bg-white rounded-3xl mx-auto mt-20 p-8 shadow-2xl outline-none overflow-y-auto border border-slate-100"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home
