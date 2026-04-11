import React, { useEffect, useMemo, useState } from "react";
import {
  CircleCheckBig,
  CircleX,
  Pencil,
  Star,
  Trash2,
  Trash,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../Css/Notes.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/authReducer";
import {
  deleteNote,
  multipeRestore,
  multipleDeleteNote,
  restoreFromRecycle,
} from "../redux/reducers/notesReducer";

const Recycle = () => {
  const dispatch = useDispatch();
  let [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Sorting");
  const [edit, setEdit] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.data);
  const data = useSelector((state)=> state.note.notes)
  console.log(data)
  useEffect(() => {
    if (userId) {
      setUser(userId);
    }
  }, [userId]);

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
      toast.error("Error :", error.message);
    }
  };

  const handleDelete = (id) => {
    try {
      dispatch(deleteNote({ id: id }));

      toast.success("Note delete..");
      data.filter((note) => note.id !== id);
      DeleteData();
    } catch (error) {
      toast.error(error || "something wrong");
    }
  };

  const DeleteData = async () => {
    try {
      const res = await window.api.deleteNote({ id: id });
      if (res.success) {
        dispatch(deleteNote({ id: id }));
        toast.success("Deleted Permantly");
      } else {
        console.log(res.error);
      }
    } catch (error) {
      console.error(error);
    }
    setShowConfirm(false);
    setDeleteid(null);
  };

  const handleRecover = async (id) => {
    try {
      const recover = await window.api.recover({ id: id });

      if (recover.success) {
        dispatch(restoreFromRecycle({ id: id }));
        toast.success("Note recovered..");
      } else {
        toast.error(recover.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const multipleRecycle = async () => {
    try {
      const recoverMulitple = await window.api.recoverMultiple(selectedNotes);

      if (recoverMulitple.success) {
        dispatch(multipeRestore(selectedNotes));
        toast.success("Notes Recoverd..");
        setSelectedNotes([]);
        setEdit(false);
      } else {
        toast.error(recoverMulitple.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleLogOut = () => {
    toast.success("LoggedOut successfully");
    navigate("/");
    dispatch(logout());
  };

  return (
    <div className="notes-container">
      <div className="sidebar">
        <h1 className="">NoteApp</h1>

        <div className="user">
          <p className="">Logged in as</p>
          <span className="">{user?.name || "User"}</span>
        </div>

        <button className="button Addbtn" onClick={() => navigate("/add")}>
          + Add Note
        </button>

        <div className="section">
          <button className="button btn" onClick={() => navigate("/notes")}>
            All Notes
          </button>
          <button className="button btn" onClick={() => navigate("/favourite")}>
            Favorites
          </button>
          <button
            className="button btn active-recycle  "
            onClick={() => navigate("/recycle")}
          >
            Recycle Bin
          </button>
        </div>

        <button className="button logout" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
      <div className="Home">
        <div className="top">
          <h2 className="">Recycle Bin 👋</h2>

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
                <button className="button btn-red" onClick={multipleDelete}>
                  <Trash2 size={20} stroke="white" />
                </button>
                <button className="button btn-green" onClick={multipleRecycle}>
                  <CircleCheckBig size={16} stroke="white" />
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Search notes..."
              className="search"
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
            {filteredData.map((note) => (
              <div
                key={note.id}
                onClick={() => !edit && toggleSelect(note.id)}
                className={`note  ${selectedNotes.includes(note.id) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note.id)}
                  onChange={() => toggleSelect(note.id)}
                  name=""
                  id=""
                  className={edit ? "hidden" : "accent-blue-500 h-4 w-4"}
                />
                {edit ? (
                  <div className="fnbtn">
                    <button
                      className="button recoverbtn"
                      onClick={() => handleRecover(note.id)}
                    >
                      <CircleCheckBig size={16} />
                    </button>
                    <button
                      className="button deletebtn"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : null}

                <h3 className="title">{note.title}</h3>

                <p className="content">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recycle;
