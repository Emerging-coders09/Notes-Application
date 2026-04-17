import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheckBig, CircleX, FileUp, Pencil, PrinterIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useKeyboard from "../hooks/keyboard";
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
  const [search, setSearch] = useState("");
    const [print, setPrint] = useState(false);
  const searchRef = useRef(null);
  const [sort, setSort] = useState("Sorting");
  const [edit, setEdit] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const notes = useSelector((state) => state.note.notes);
  const data = useMemo(() => {
    return notes.filter((note) => note.recycle === "bin");
  }, [notes]);
  useEffect(() => {
    if (user) {
      console.log(notes);
    }
  }, [user]);

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

  const handleDelete = async (id) => {
    try {
      const res = await window.api.deleteNote({ id });

      if (res.success) {
        dispatch(deleteNote({ id }));
        toast.success("Deleted permanently");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
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
  const selectedNote = filteredData[selectedIndex];

  useKeyboard({
    selectedNote,
    selectedNotes,
    filteredLength: filteredData.length,
    edit,
    searchRef,

    actions: {
      onDown: () =>
        setSelectedIndex((prev) => Math.min(prev + 1, filteredData.length - 1)),

      onUp: () => setSelectedIndex((prev) => Math.max(prev - 1, 0)),

      onToggleSelect: (id) => toggleSelect(id),

      onAdd: () => navigate("/add"),

      onLogout: () => handleLogOut(),

      onEnterEdit: () => setEdit(false),

      onExitEdit: () => {
        setEdit(true);
        setSelectedNotes([]);
      },

      onDeleteSingle: (id) => handleDelete(id),

      onRecoverSingle: (id) => handleRecover(id),

      onDeleteMultiple: () => multipleDelete(),

      onRecoverMultiple: () => multipleRecycle(),

        onPrint: () => {
        setPrint(true);
      },

      onConfirmPrint: () => {
        handlePrint();
      },

      exportPdf: () => {
        handlePrintPDF();
      },
      ClosePrintShow : ()=>{
        setPrint(false)
      },

      onEscape: () => {
        setEdit(true);
        setSelectedNotes([]);
      },
      ToAllNotes : () => {
        navigate('/notes')
      },
      ToFavourite : ()=> {
        navigate('/favourite')
      }
    },
  });

  const handleLogOut = () => {
    toast.success("LoggedOut successfully");
    navigate("/");
    dispatch(logout());
  };
  const printableData =
    selectedNotes.length > 0
      ? filteredData.filter((note) => selectedNotes.includes(note.id))
      : filteredData;

  const handlePrint = () => {
    document.body.classList.add("printing");
    window.api.print();

    setTimeout(() => {
      document.body.classList.remove("printing");
    }, 1000);
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
                onClick={() => !edit && toggleSelect(note.id)}
                type="button"
                onKeyDown={(e) => e.preventDefault()}
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
                      className="button recoverbtn"
                      onClick={() => handleRecover(note.id)}
                    >
                      <CircleCheckBig size={16} />
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
        {print && (
        <div className="print-overlay">
          <div className="print-modal">
            <div className="print-header-ui">
              <h2>Print Preview</h2>

              <div className="print-actions">
                <button className="btn btn-green" onClick={handlePrint}>
                  <PrinterIcon stroke="white" />
                </button>

                <button
                  className="btn btn-orange"
                  onClick={() => setPrint(false)}
                >
                  <CircleX stroke="white" />
                </button>

                <button className="btn" onClick={handlePrintPDF}>
                  <FileUp stroke="white" />
                </button>
              </div>
            </div>

            <div className="print-preview">
              <div className="print-paper">
                <h1 className="doc-title">My Notes</h1>
                <p className="doc-date">{new Date().toLocaleString()}</p>

                {printableData.map((note) => (
                  <div key={note.id} className="doc-note">
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Recycle;
