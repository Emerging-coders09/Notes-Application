import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleX, Pencil, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Favourite = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  let [user, setUser] = useState(null);
  const [edit, setEdit] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const notes = await window.api.getfavourite({ user_id: user.id });
      setData(notes.data);
    }
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    const isConfirmed = confirm("Want to delete this note?");

    if (!isConfirmed) return;

    try {
      const del = await window.api.deleteNote({ id: id });

      if (del.success) {
        toast.success("Note delete..");
        setData(data.filter((note) => note.id !== id));
      } else {
        console.log(del.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const filterData = search.trim()
    ? data.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()),
      )
    : data;

  const handleFavourite = async (user_id, id) => {
    try {
      const getunfavourite = await window.api.unfavourite({
        user_id: user_id,
        id: id,
      });
      setData(data.filter((note) => note.id !== id));
      if (getunfavourite.success) {
        toast.success("Notes deleted from favourite");
      } else {
        toast.error(getunfavourite.error);
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

  const handleLogOut = () => {
    localStorage.removeItem("user");
    toast.success("LoggedOut successfully");
    navigate("/");
  };

  return (
    <div className="w-full h-screen flex bg-gray-100">
      <div className="w-[260px] bg-white shadow-md p-5 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">NoteApp</h1>

        <div className="mb-6 p-3 bg-gray-100 rounded-xl">
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="font-medium text-gray-800 truncate">
            {user?.name || "User"}
          </p>
        </div>

        <button
          className="bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          onClick={() => navigate("/add")}
        >
          + Add Note
        </button>

        <div className="text-sm mt-6 space-y-2 flex flex-col items-start">
          <button
            className="cursor-pointer hover:bg-gray-100  px-3 py-2 rounded-lg w-full outline-none"
            onClick={() => navigate("/notes")}
          >
            All Notes
          </button>
          <button className="cursor-pointer  text-blue-600 bg-blue-100 px-3 py-2 rounded-lg w-full outline-none">
            Favorites
          </button>
        </div>

        <button
          className="mt-auto bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Favourite Notes 👋
          </h2>
          <div className="flex gap-2">
            {edit ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 p-3 rounded-md cursor-pointer"
                onClick={() => {
                  setEdit(false);
                  setSelectedNotes([]);
                }}
              >
                <Pencil size={20} stroke="white" />
              </button>
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
              className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filterData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
            <p className="text-lg">No notes yet</p>
            <p className="text-sm">Start by adding a new note</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filterData.map((note) => (
              <div
                key={note.id}
                onClick={() => !edit && toggleSelect(note.id)}
                className={`bg-white p-5 rounded-2xl shadow hover:shadow-lg transition relative group cursor-pointer  ${selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""}`}
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
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                      onClick={() => navigate(`/update/${note.id}`)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-black p-2 rounded-md cursor-pointer"
                      onClick={() =>
                        handleFavourite(note.user_id, note.id, note.like)
                      }
                    >
                      <Star
                        size={18}
                        fill={note.like === 1 ? "yellow" : "white"}
                      />
                    </button>

                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : null}

                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {note.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-3">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite;
