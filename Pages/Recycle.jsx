import React, { useEffect, useMemo, useState } from "react";
import { CircleCheckBig, CircleX, Pencil, Star, Trash2 , Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Recycle = () => {
  let [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const notes = await window.api.getrecycle({ user_id: user.id });
        setData(notes?.data || []);
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

  const handleDelete = async (id) => {
    try {
      const del = await window.api.deleteNote({ id: id });

      if (del.success) {
        toast.success("Note delete..");
        setData((prev) => prev.filter((note) => note.id !== id));
      } else {
        toast.error(del.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRecover = async (id ) => {
        try {
            const recover = await window.api.recover({ id : id})

            if(recover.success){
                toast.success("Note recovered..")
                setData((prev)=> prev.filter((note)=> note.id !== id))
            } else {
                toast.error(recover.error)
            }
        } catch (error) {
            toast.error(error)
        }
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
            className="cursor-pointer hover:bg-blue-200  text-black px-3 py-2 rounded-lg w-full outline-none"
            onClick={() => navigate("/notes")}
          >
            All Notes
          </button>
          <button
            className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg w-full outline-none"
            onClick={() => navigate("/favourite")}
          >
            Favorites
          </button>
          <button
            className="cursor-pointer hover:bg-green-200 px-3 py-2 rounded-lg w-full outline-none text-green-600 bg-green-100"
            onClick={() => navigate("/recycle")}
          >
            Recycle Bin
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
            Recycle Bin 👋
          </h2>

          <div className="flex gap-2">
            {edit ? (
              <div className="flex gap-3 justify-center items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 p-3 rounded-md cursor-pointer"
                  onClick={() => {
                    setEdit(false);
                    setSelectedNotes([]);
                  }}
                >
                  <Pencil size={20} stroke="white" />
                </button>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-xl shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                      hover:border-gray-400 transition cursor-pointer"
                  >
                    <option value="Sorting">Sort By</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                    <option value="Newest">Newest</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
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
              className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
            <p className="text-lg">No notes yet</p>
            <p className="text-sm">Start by adding a new note</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredData.map((note) => (
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
                      className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                      onClick={() => handleRecover(note.id)}
                    >
                      <CircleCheckBig size={16} />
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

export default Recycle;
