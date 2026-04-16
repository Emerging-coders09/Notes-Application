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
import "../Css/Printlayout.css";
import { logout } from "../redux/reducers/authReducer";
import {
  deleteNote,
  moveMultipleToRecycle,
  moveToRecycle,
  multipleDeleteNote,
  toggleFavourite,
} from "../redux/reducers/notesReducer";
import useKeyboard from "../hooks/keyboard";

const Favourite = () => {
  const navigate = useNavigate();
  const [print, setPrint] = useState(false);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Sorting");
  const [selectedIndex, setSelectedIndex] = useState(0);
  let [user, setUser] = useState(null);
  const [edit, setEdit] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null);
  const notes = useSelector((state) => state.note.notes);
  const data = useMemo(() => {
    return notes.filter((note) => note.like === 1);
  }, [notes]);

  const userId = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (userId) {
      setUser(userId);
    }
  }, [userId]);

  const handleDelete = (id) => {
    setShowConfirm(true);
    if (selectedNotes.length === 0) {
      setDeleteid(id);
    }
  };
  const handleConfirmDelete = () => {
    console.log(deleteid);
    try {
      dispatch(deleteNote({ id: deleteid }));

      toast.success("Note delete..");
      data.filter((note) => note.id !== deleteid);
      DeleteData();
    } catch (error) {
      toast.error(error || "something wrong");
    }
  };

  const DeleteData = async () => {
    try {
      const res = await window.api.deleteNote({ id: deleteid });
      if (res.success) {
        dispatch(deleteNote({ id: deleteid }));
        console.log("success on delete");
      } else {
        console.log(res.error);
      }
    } catch (error) {
      console.error(error);
    }
    setShowConfirm(false);
    setDeleteid(null);
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

  useEffect(() => {
    if (selectedIndex >= filteredData.length) {
      setSelectedIndex(filteredData.length - 1);
    }
  }, [filteredData.length]);

  const selectedNote = filteredData[selectedIndex];

  const handleFavourite = async (user_id, id) => {
    try {
      const res = await window.api.unfavourite({
        user_id: user_id,
        id: id,
      });
      if (res.success) {
        dispatch(toggleFavourite({ user_id: user_id, id: id }));
        toast.success("Notes deleted from favourite");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Catch error :", error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((noteid) => noteid !== id)
        : [...prev, id],
    );
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
      await window.api.unfavourite({
        user_id: user.id,
        id: deleteid,
      });
      if (res.success) {
        dispatch(moveToRecycle({ id: deleteid }));
        toast.success("Moved to Recycled Bin");
      }
    } catch (error) {
      toast.error(res.error);
    }

    setShowConfirm(false);
    setDeleteid(null);
  };

  useKeyboard({
    selectedNote,
    selectedNotes,
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

      onRecoverSingle: () => {}, // not needed

      // 🔹 Multiple
      onDeleteMultiple: () => {
        setShowConfirm(true);
      },

      onRecoverMultiple: () => {},
      onEscape: () => {
        setEdit(true);
        setSelectedNotes([]);
        setShowConfirm(false);
      },

      onPrint: () => {
        if(printableData.length === 0) return toast.error("Please select Notes to Print")
        handlePrint();
      },

      onConfirmPrint: () => {
        
      },

      exportPdf: () => {
        handlePrintPDF();
      },
      // 🔹 Escape
      ClosePrintShow: () => {
        setPrint(false);
      },

      onToggleFavourite: () => {
        if (!selectedNote) return;

        handleFavourite(selectedNote.user_id, selectedNote.id);
      },

      ToRecycle: () => {
        navigate("/recycle");
      },
      ToAllNotes: () => {
        navigate("/notes");
      },
       ToUpdateNote : ()=>{
        navigate(`/update/${selectedNote.id}`)
      }
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

      if (key === "escape" || key === "c") {
        e.preventDefault();
        setShowConfirm(false);
      }
    };

    window.addEventListener("keydown", handleModalKeys);
    return () => window.removeEventListener("keydown", handleModalKeys);
  }, [showConfirm, selectedNotes]);

  const handleLogOut = () => {
    toast.success("LoggedOut successfully");
    navigate("/");
    dispatch(logout());
  };

  const printableData =
    selectedNotes.length > 0
      ? filteredData.filter((note) => selectedNotes.includes(note.id))
      : [];

  const handlePrint = () => {
    // document.body.classList.add("printing");
    // window.api.print();

    // setTimeout(() => {
    //   document.body.classList.remove("printing");
    // }, 1000);
    if(printableData.length === 0) return toast.error("Please select Notes to Print")
    window.api.print(printableData , userId);
  };

  const handlePrintPDF = async () => {
    window.api.printPDF();
  };

  return (
    <div className="notes-container">
      <div className="sidebar">
        <h1 className="">NoteApp</h1>

        <div className="user">
          <p className="">Logged in as</p>
          <span className="">{user?.name || "User"}</span>
        </div>

        <button className="Addbtn button" onClick={() => navigate("/add")}>
          + Add Note
        </button>

        <div className="section">
          <button className="button btn" onClick={() => navigate("/notes")}>
            All Notes
          </button>
          <button className="button btn active-favourite ">Favorites</button>
          <button className="button btn" onClick={() => navigate("/recycle")}>
            Recycle Bin
          </button>
        </div>

        <button className="logout" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
      <div className="Home">
        <div className="top">
          <h2 className="">Favourite Notes 👋</h2>
          <div className="left-top">
            {edit ? (
              <div className="left-top">
                <button
                  className="edit button"
                  onClick={() => {
                    setEdit(false);
                    setSelectedNotes([]);
                  }}
                >
                  <Pencil size={20} stroke="white" />
                </button>
                <div className="sortselect">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className=""
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
                  onClick={() => {
                    setEdit(true);
                    setSelectedNotes([]);
                  }}
                >
                  <CircleX size={20} stroke="white" />
                </button>
                <button className="button btn-red">
                  <Trash2 size={20} stroke="white" onClick={handleDelete} />
                </button>
                <button
                  onClick={() => setPrint(true)}
                  className="button btn-green"
                >
                  <Printer stroke="white" />
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Search notes..."
              className="search"
              onChange={(e) => setSearch(e.target.value)}
              ref={searchRef}
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
                onClick={() => !edit && toggleSelect(note.id)}
                onKeyDown={(e) => e.preventDefault()}
                className={`note ${selectedNotes.includes(note.id) ? "selected" : ""} ${index === selectedIndex ? "active-note" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note.id)}
                  onChange={() => toggleSelect(note.id)}
                  tabIndex={-1}
                  onKeyDown={(e) => e.preventDefault()}
                  name=""
                  id=""
                  className={edit ? "hidden" : "checked"}
                />
                {edit ? (
                  <div className="fnbtn">
                    <span
                      className="button editbtn"
                      onClick={() => navigate(`/update/${note.id}`)}
                    >
                      <Pencil size={16} />
                    </span>
                    <span
                      className="button"
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
                      className="button deletebtn"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 size={16} />
                    </span>
                  </div>
                ) : null}

                <h3 className="title">{note.title}</h3>

                <p className="content">{note.content}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="">Delete this note?</h3>
            <p className="">This action cannot be undone.</p>

            <div className="modal-box-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-orange modal-btn"
              >
                <CircleX />
              </button>

              <button
                onClick={
                  selectedNotes.length === 0
                    ? handleConfirmDelete
                    : multipleDelete
                }
                className="modal-btn btn-red"
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

export default Favourite;
