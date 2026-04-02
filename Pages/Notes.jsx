import React from 'react'
import { useNavigate } from 'react-router-dom'

const Notes = () => {
  const navigate = useNavigate()


  const handleLogOut = ()=>{
    alert("LoggedOut successfully")
    navigate('/')
  }

  return (
    <div className="w-full h-screen flex bg-gray-100">

      <div className="w-[250px] bg-white shadow-md p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-800">NoteApp</h1>

        <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer">
          + Add Note
        </button>

        <div className="text-gray-500 text-sm mt-4">
          <p className="cursor-pointer hover:text-black">All Notes</p>
          <p className="cursor-pointer hover:text-black">Favorites</p>
        </div>

        <button className="mt-auto bg-red-400 text-white py-2 rounded-lg hover:bg-red-600 transition cursor-pointer" onClick={handleLogOut}>
          Log Out
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Your Notes</h2>

          <input
            type="text"
            placeholder="Search notes..."
            className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800">Meeting Notes</h3>
            <p className="text-sm text-gray-500 mt-2">
              Discuss project timeline and deliverables...
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800">Ideas</h3>
            <p className="text-sm text-gray-500 mt-2">
              Build a note-taking app with Electron...
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800">To Do</h3>
            <p className="text-sm text-gray-500 mt-2">
              Finish UI, connect database, test app...
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Notes