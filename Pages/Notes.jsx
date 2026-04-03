import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Notes = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  let [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const notes = await window.api.getNotes({ user_id: user.id });
      setData(notes.data);
    }
    fetchData();
  }, [user]);

  useEffect(() => {
    console.log("Updated data:", data);
    console.log("User : ", user);
  }, [data, user]);

  const handleDelete = async (id) => {
    const isConfirmed = confirm("Want to delete this note?")

      if (!isConfirmed) return


      try {
        const del = await window.api.deleteNote({ id: id });

        if (del.success) {
          toast("Note delete..")
          setData(data.filter(note => note.id !== id));
        } else {
          console.log(del.error);
        }
      } catch (error) {
        console.error(error);
      }
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    toast.success("LoggedOut successfully")
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

        <div className="text-sm mt-6 space-y-2">
          <p className="cursor-pointer bg-blue-100 text-blue-600 px-3 py-2 rounded-lg">
            All Notes
          </p>
          <p className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg">
            Favorites
          </p>
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
          <h2 className="text-2xl font-semibold text-gray-800">Welcome 👋</h2>

          <input
            type="text"
            placeholder="Search notes..."
            className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
            <p className="text-lg">No notes yet</p>
            <p className="text-sm">Start by adding a new note</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((note) => (
              <div
                key={note.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition relative group"
              >
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    onClick={() => navigate(`/update/${note.id}`)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

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

export default Notes;
