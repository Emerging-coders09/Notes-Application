import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

const Add = () => {
  const navigate = useNavigate()
  const [title , setTitle] = useState('')
  const [content , setContent] = useState("")
  
  const handleSave = async ()=>{
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const addata = await window.api.addNote({
        user_id : user.id,
        title : title,
        content : content
      })
      
      if(addata.success){
        toast.success("Note saved successfully 🎉")
        navigate('/notes')
      }else {
        console.log("Error : " , addata.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-start p-8">

      <div className="w-full max-w-3xl">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add Note</h1>

          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5">

          <input
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <div className="h-[1px] bg-gray-200" />

          <textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="12"
            className="px-4 py-3 border rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
          />

          <div className="flex justify-between items-center mt-2">

            <p className="text-sm text-gray-400">
              Your notes are saved locally
            </p>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition shadow-md hover:shadow-lg"
            >
              <Save size={16} />
              Save Note
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Add