import React, { use, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleX, Pencil, Recycle, Star, Trash, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import '../Css/Notes.css'

const Notes = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Sorting");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  let [user, setUser] = useState(null);
  const [edit, setEdit] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const notes = await window.api.getNotes({ user_id: user.id });
        setData(notes?.data || []);
        console.log(data)
      } catch (error) {
        toast.error("Failed to fetch notes");
      }
    }
    fetchData();
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

  const toggleSelect = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((noteid) => noteid !== id)
        : [...prev, id],
    );
  };

  const handleDelete = (id) => {
    setDeleteid(id);
    setShowConfirm(true);
  };
  const handleConfirmDelete = async () => {
    try {
      const del = await window.api.deleteNote({ id: deleteid });

      if (del.success) {
        toast.success("Note delete..");
        setData((prev) => prev.filter((note) => note.id !== deleteid));
      } else {
        toast.error(del.error);
      }
    } catch (error) {
      toast.error(error);
    }
    setShowConfirm(false);
    setDeleteid(null);
  };

  const handleFavourite = async (user_id, id, like) => {
    try {
      if (like !== 1) {
        const favourite = await window.api.favourite({
          user_id: user_id,
          id: id,
        });
        if (favourite.success) {
          toast.success("Notes Added to favourite");

          setData((prev) =>
            prev.map((note) => (note.id === id ? { ...note, like: 1 } : note)),
          );
        } else {
          toast.error(favourite.error);
        }
      } else {
        const getunfavourite = await window.api.unfavourite({
          user_id: user_id,
          id: id,
        });

        if (getunfavourite.success) {
          toast.success("Notes deleted from favourite");

          setData((prev) =>
            prev.map((note) => (note.id === id ? { ...note, like: 0 } : note)),
          );
        } else {
          toast.error(getunfavourite.error);
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const multipleDelete = async () => {
    try {
      const res = await window.api.deleteMultiple(selectedNotes);

      if (res.success) {
        toast.success("Notes deleted.");
        setData((prev) =>
          prev.filter((note) => !selectedNotes.includes(note.id)),
        );
        setSelectedNotes([]);
        setEdit(false);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error :", error);
    }

    console.log(selectedNotes);
  };

  const handleRecycle = async ()=>{
    try {
      const res = await window.api.recyclebin({ id : deleteid})
      await window.api.unfavourite({
        user_id: user.id,
        id: deleteid,
      });
      if(res.success){
        toast.success("Moved to Recycled Bin")
        const notes = await window.api.getNotes({ user_id: user.id });
        setData(notes?.data || [])
      }

    } catch (error) {
      toast.error(res.error)
    }

    setShowConfirm(false);
    setDeleteid(null);

  }

  const handleLogOut = () => {
    localStorage.removeItem("user");
    toast.success("LoggedOut successfully");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1 className="">NoteApp</h1>

        <div className="user">
          <p className="">Logged in as</p>
          <span className="">
            {user?.name || "User"}
          </span>
        </div>

        <button
          className="Addbtn button"
          onClick={() => navigate("/add")}
        >
          + Add Note
        </button>

        <div className="section">
          <button className="button btn">
            All Notes
          </button>
          <button
            className=" button btn"
            onClick={() => navigate("/favourite")}
          >
            Favorites
          </button>
          <button
            className=" button btn"
            onClick={() => navigate("/recycle")}
          >
            Recycle Bin
          </button>
        </div>

        <button
          className="logout button"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>

      <div className="Home">
        <div className="top">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome 👋</h2>

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

                  <div className="arrow">
                    ▼
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  className="bg-orange-500 hover:bg-orange-600 p-3 rounded-md cursor-pointer"
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  <CircleX size={20} stroke="white" />
                </button>
                <button className="bg-red-500 hover:bg-red-600 p-3 rounded-md cursor-pointer">
                  <Trash2 size={20} stroke="white" onClick={multipleDelete} />
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
                className={`note  ${selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""}`}
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
                      className="button editbtn"
                      onClick={() => navigate(`/update/${note.id}`)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
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
                    </button>

                    <button
                      className="button deletebtn"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : null}

                <h3 className="title">
                  {note.title}
                </h3>

                <p className="content">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[300px] text-center">
            <h3 className="text-lg font-semibold mb-3">Delete this note?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                <CircleX/>
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                <Trash /> 
              </button>
              <button
                onClick={handleRecycle}
                className="px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
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
