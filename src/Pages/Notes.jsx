import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleX,
  FileUp,
  Pencil,
  Printer,
  PrinterIcon,
  Recycle,
  Star,
  Trash,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import "../Css/Notes.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAll,
  deleteNote,
  getNotes,
  moveMultipleToRecycle,
  moveToRecycle,
  multipleDeleteNote,
  toggleFavourite,
} from "../redux/reducers/notesReducer";
import { logout } from "../redux/reducers/authReducer";
import useKeyboard from "../hooks/keyboard";

const Notes = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Sorting");

  const [Psize, setPsize] = useState("A4");
  const sizeRef = useRef("A4");
  const navigate = useNavigate();
  const [edit, setEdit] = useState(true);
  const [print, setPrint] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null);
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const notes = useSelector((state) => state.note.notes);
  const data = useMemo(() => {
    return notes.filter((note) => note.recycle !== "bin");
  }, [notes]);
  const userId = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (userId?.id) {
      fetchNotes(userId.id);
    }
  }, [userId]);

  const fetchNotes = async (id) => {
    try {
      const res = await window.api.getNotes({ user_id: id });

      if (res.success) {
        dispatch(getNotes(res.data));
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredData = useMemo(() => {
    let filterData = search.trim()
      ? data.filter(
          (note) =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase()),
        )
      : data;

    switch (sort) {
      case "Sorting":
        return filterData;

      case "Ascending":
        return [...filterData].sort((a, b) => a.title.localeCompare(b.title));

      case "Descending":
        return [...filterData].sort((a, b) => b.title.localeCompare(a.title));

      case "Newest":
        return [...filterData].sort((a, b) => b.id - a.id);

      default:
        return filterData;
    }
  }, [search, data, sort]);

  const toggleSelect = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((noteid) => noteid !== id)
        : [...prev, id],
    );
  };

  useEffect(() => {
    if (selectedIndex >= filteredData.length) {
      setSelectedIndex(filteredData.length - 1);
    }
  }, [filteredData.length]);

  const handleDelete = (id) => {
    setShowConfirm(true);
    if (selectedNotes.length === 0) {
      setDeleteid(id);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await window.api.deleteNote({ id: deleteid });

      if (res.success) {
        dispatch(deleteNote({ id: deleteid }));
        console.log("success on delete");
      } else {
        console.log(res.error);
      }

      toast.success("Note delete..");
    } catch (error) {
      toast.error(error.message);
    }
    setShowConfirm(false);
    setDeleteid(null);
  };

  const handleFavourite = async (user_id, id, like) => {
    try {
      let newLike = like === 1 ? 0 : 1;

      const res =
        like !== 1
          ? await window.api.favourite({ user_id: user_id, id: id })
          : await window.api.unfavourite({ user_id: user_id, id: id });

      if (res.success) {
        dispatch(toggleFavourite({ id: id, like: newLike }));

        toast.success(
          newLike === 1 ? "Added to Favourite" : "Removed from favourite",
        );
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const multipleDelete = async () => {
    try {
      const res = await window.api.deleteMultiple(selectedNotes);

      if (res.success) {
        dispatch(multipleDeleteNote(selectedNotes));
        toast.success("Notes deleted.");
        setSelectedNotes([]);
        setEdit(false);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error :", error);
    }
    setShowConfirm(false);
    setDeleteid(null);
  };
  const handleMultipleRecycle = async () => {
    try {
      const res = await window.api.recycleMultiple(selectedNotes);

      if (res.success) {
        dispatch(moveMultipleToRecycle(selectedNotes));
        toast.success("Notes Moved to Recycle.");
        setSelectedNotes([]);
        setEdit(false);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(error);
    }
    setShowConfirm(false);
    setDeleteid(null);
  };

  const handleRecycle = async () => {
    try {
      const res = await window.api.recyclebin({ id: deleteid });
      if (res.success) {
        dispatch(moveToRecycle({ id: deleteid }));
        toast.success("Moved to Recycled Bin");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setShowConfirm(false);
    setDeleteid(null);
  };

  const handleLogOut = () => {
    toast.success("LoggedOut successfully");
    navigate("/");
    dispatch(logout());
    dispatch(clearAll());
  };
  const selectedNote = filteredData[selectedIndex];

  useKeyboard({
    selectedNote,
    selectedNotes,
    print,
    filteredLength: filteredData.length,
    edit,
    searchRef,

    actions: {
      // 🔹 Navigation
      onDown: () =>
        setSelectedIndex((prev) => Math.min(prev + 1, filteredData.length - 1)),

      onUp: () => setSelectedIndex((prev) => Math.max(prev - 1, 0)),

      // 🔹 Selection
      onToggleSelect: (id) => toggleSelect(id),

      // 🔹 Global
      onAdd: () => navigate("/add"),

      onLogout: () => handleLogOut(),

      onEnterEdit: () => {
        setEdit(false);
        setSelectedNotes([]);
      },

      onExitEdit: () => {
        setEdit(true);
        setSelectedNotes([]);
      },

      // 🔹 Single actions
      onDeleteSingle: (id) => {
        setDeleteid(id);
        setShowConfirm(true);
      },

      // 🔹 Multiple actions
      onDeleteMultiple: () => {
        setShowConfirm(true);
      },

      // 🔹 Escape
      onEscape: () => {
        setEdit(true);
        setSelectedNotes([]);
        setShowConfirm(false);
      },
      onPrint: () => {
        if (printableData.length === 0)
          return toast.error("Please select Notes to Print");
        handlePrint();
      },

      onToggleFavourite: () => {
        if (!selectedNote) return;

        handleFavourite(
          selectedNote.user_id,
          selectedNote.id,
          selectedNote.like,
        );
      },

      ToRecycle: () => {
        navigate("/recycle");
      },
      ToFavourite: () => {
        navigate("/favourite");
      },

      ToUpdateNote: () => {
        navigate(`/update/${selectedNote.id}`);
      },
    },
  });

  useEffect(() => {
    if (!showConfirm) return;

    const handleModalKeys = (e) => {
      const key = e.key.toLowerCase();

      if (key === "delete") {
        e.preventDefault();
        selectedNotes.length === 0 ? handleConfirmDelete() : multipleDelete();
      }

      if (key === "r") {
        e.preventDefault();
        selectedNotes.length === 0 ? handleRecycle() : handleMultipleRecycle();
      }

      if (key === "escape") {
        e.preventDefault();
        setShowConfirm(false);
      }
    };

    window.addEventListener("keydown", handleModalKeys);
    return () => window.removeEventListener("keydown", handleModalKeys);
  }, [showConfirm, selectedNotes]);

  const printableData =
    selectedNotes.length > 0
      ? filteredData.filter((note) => selectedNotes.includes(note.id))
      : [];

  const handleChange = (e) => {
    setPsize(e.target.value);
    sizeRef.current = e.target.value;
  };

  const handlePrint = () => {
    window.api.print(printableData, userId, sizeRef.current);
  };

  
  const navigateFavourite = ()=>{
    navigate('/favourite')
  }

  const navigateAdd = ()=>{
    navigate('/add')
  }
  const navigateRecycle = ()=>{
    navigate('/recycle')
  }
  const navigateUpdate = (id)=>{
    navigate(`/update${id}`)
  }
  

  const setEditFalse = ()=>{
    setEdit(false);
    setSelectedNotes([]);
  }
  const setEditTrue = ()=>{
    setEdit(true);
    setSelectedNotes([]);
  }
  const showConfirmFalse = ()=>{
    setShowConfirm(false)
  }

  return (
    <div className="notes-container">
      <div className="sidebar">
        <h1 className="">NoteApp</h1>

        <div className="user">
          <p className="">Logged in as</p>
          <span className="">{userId?.name || "User"}</span>
        </div>

        <button className="Addbtn button" onClick={navigateAdd}>
          + Add Note
        </button>

        <div className="section">
          <button className="button btn active-all">All Notes</button>
          <button
            className=" button btn"
            onClick={navigateFavourite}
          >
            Favorites
          </button>
          <button className=" button btn" onClick={navigateRecycle}>
            Recycle Bin
          </button>
        </div>

        <button className="logout button" onClick={handleLogOut}>
          Log Out
        </button>
      </div>

      <div className="Home">
        <div className="top">
          <h2 className="">Welcome 👋</h2>

          <div className="left-top">
            {edit ? (
              <div className="left-top">
                <button
                  className="edit button"
                  onClick={setEditFalse}
                >
                  <Pencil size={20} stroke="white" />
                </button>
                <div className="sortselect">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="select"
                  >
                    <option value="Sorting">Sort By</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                    <option value="Newest">Newest</option>
                  </select>

                  <div className="arrow">▼</div>
                </div>
              </div>
            ) : (
              <div className="left-top">
                <button
                  className="button btn-orange"
                  onClick={setEditTrue}
                >
                  <CircleX size={20} stroke="white" />
                </button>
                <button className="button btn-red" onClick={handleDelete}>
                  <Trash2 size={20} stroke="white" />
                </button>
                <button
                  onClick={handlePrint}
                  className="button btn-green"
                >
                  <Printer stroke="white" />
                </button>
                <div className="sortselect">
                  <select
                    name=""
                    id=""
                    className="select"
                    value={Psize}
                    onChange={handleChange}
                  >
                    <option value="A4">A4</option>
                    <option value="3-inch">3-inch</option>
                    <option value="2-inch">2-inch</option>
                  </select>
                  <div className="arrow">▼</div>
                </div>
              </div>
            )}

            <input
              type="text"
              placeholder="Search notes..."
              className="search"
              ref={searchRef}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">
            <p className="">No notes yet</p>
            <p className="">Start by adding a new note</p>
          </div>
        ) : (
          <div className="data">
            {filteredData.map((note, index) => (
              <button
                key={note.id}
                type="button"
                onKeyDown={(e) => e.preventDefault()}
                onClick={() => !edit && toggleSelect(note.id)}
                className={`note ${selectedNotes.includes(note.id) ? "selected" : ""} ${index === selectedIndex ? "active-note" : ""}`}
              >
                <input
                  type="checkbox"
                  tabIndex={-1}
                  onKeyDown={(e) => e.preventDefault()}
                  checked={selectedNotes.includes(note.id)}
                  onChange={() => toggleSelect(note.id)}
                  name=""
                  id=""
                  className={edit ? "hidden" : "checked"}
                />
                {edit ? (
                  <div className="fnbtn">
                    <span
                      className="ftnbutton editbtn"
                      onClick={() => navigateUpdate(note.id)}
                    >
                      <Pencil size={16} />
                    </span>
                    <span
                      className="ftnbutton"
                      onClick={() =>
                        handleFavourite(note.user_id, note.id, note.like)
                      }
                    >
                      <Star
                        size={18}
                        fill={note.like === 1 ? "yellow" : "white"}
                        stroke="black"
                      />
                    </span>

                    <span
                      className="ftnbutton deletebtn"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 size={16} />
                    </span>
                  </div>
                ) : null}

                <h3
                  className={`title ${index === selectedIndex ? "underline" : ""}`}
                >
                  {note.title}
                </h3>

                <p className="content">{note.content}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box ">
            <h3 className="">Delete this note?</h3>
            <p className="">This action cannot be undone.</p>

            <div className=" modal-box-1">
              <button
                onClick={showConfirmFalse}
                className="btn-orange  modal-btn"
              >
                <CircleX />
              </button>

              <button
                onClick={
                  selectedNotes.length === 0
                    ? handleConfirmDelete
                    : multipleDelete
                }
                className="btn-red modal-btn"
              >
                <Trash />
              </button>
              <button
                onClick={
                  selectedNotes.length === 0
                    ? handleRecycle
                    : handleMultipleRecycle
                }
                className="modal-btn btn-green"
              >
                <Recycle />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
