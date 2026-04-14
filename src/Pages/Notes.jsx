import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleX, Pencil, Recycle, Star, Trash, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import "../Css/Notes.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAll,
  deleteNote,
  getNotes,
  moveMultipleToRecycle,
  moveToRecycle,
  multipeRestore,
  multipleDeleteNote,
  toggleFavourite,
} from "../redux/reducers/notesReducer";
import { logout } from "../redux/reducers/authReducer";

const Notes = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Sorting");
  const navigate = useNavigate();
  let [user, setUser] = useState(null);
  const [edit, setEdit] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null);
  const dispatch = useDispatch();
  const searchRef = useRef(null)
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

  useEffect(() => {
    const handlekeydown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.ctrlKey || e.key === "F11") {
        e.preventDefault();
      }

      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        navigate("/add");
      }
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        handleLogOut();
      }
      if (e.key === "F11" && selectedNote) {
        handleFavourite(
          selectedNote.user_id,
          selectedNote.id,
          selectedNote.like,
        );
      }
      if (e.ctrlKey && e.key === "Delete" && selectedNote) {
        setDeleteid(selectedNote.id);
        setShowConfirm(true);
      }

      if (e.ctrlKey && e.key === "ArrowRight" && selectedNote) {
        navigate(`/update/${selectedNote.id}`);
      }
      if (e.ctrlKey && e.key === "Enter" && selectedNote) {
        toggleSelect(selectedNote.id);
      }

      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < filteredData.length - 1 ? prev + 1 : prev,
        );
      }

      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault()

        if(searchRef.current){
          searchRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handlekeydown);
    return () => window.removeEventListener("keydown", handlekeydown);
  }, []);

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

  const selectedNote = filteredData[selectedIndex];
  const handleDelete = (id) => {
    setShowConfirm(true);
    if (selectedNotes.length === 0) {
      setDeleteid(id);
    }
  };

  const handleConfirmDelete = async () => {
    console.log(deleteid);
    try {
      dispatch(deleteNote({ id: deleteid }));

      const res = await window.api.deleteNote({ id: deleteid });
      if (res.success) {
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

  return (
    <div className="notes-container">
      <div className="sidebar">
        <h1 className="">NoteApp</h1>

        <div className="user">
          <p className="">Logged in as</p>
          <span className="">{userId?.name || "User"}</span>
        </div>

        <button className="Addbtn button" onClick={() => navigate("/add")}>
          + Add Note
        </button>

        <div className="section">
          <button className="button btn active-all">All Notes</button>
          <button
            className=" button btn"
            onClick={() => navigate("/favourite")}
          >
            Favorites
          </button>
          <button className=" button btn" onClick={() => navigate("/recycle")}>
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
                  onClick={() => {
                    setEdit(true);
                    setSelectedNotes([]);
                  }}
                >
                  <CircleX size={20} stroke="white" />
                </button>
                <button className="button btn-red" onClick={handleDelete}>
                  <Trash2 size={20} stroke="white" />
                </button>
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
                onClick={() => !edit && toggleSelect(note.id)}
                className={`note ${selectedNotes.includes(note.id) ? "selected" : ""} {${index === selectedIndex ? "active-note" : ""}`}
              >
                <input
                  type="checkbox"
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
                      onClick={() => navigate(`/update/${note.id}`)}
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

                <h3 className="title">{note.title}</h3>

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
                onClick={() => setShowConfirm(false)}
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
