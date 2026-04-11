import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import '../Css/Add&Update.css'
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '../redux/reducers/notesReducer';

const Add = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [title , setTitle] = useState('')
  const [content , setContent] = useState("")
  const userId = useSelector((state)=> state.auth.user)
  
  const adduser = {
    user_id : userId.id,
    title : title,
    content : content
  }
  const handleSave = async ()=>{
    if(title === '' || content === ''){
      return toast.error("Enter both fields")
    }
    try {
      dispatch(addNote(adduser))
      
      toast.success("Note saved successfully 🎉")
      AddNoteData()
        navigate('/notes')
    } catch (error) {
      console.error(error || "Something wrong")
    }
  }

  const AddNoteData = async ()=>{
    try {
        await window.api.addNote(adduser)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container">

      <div className="box-container">

        <div className="header">
          <h1 className="">New Note</h1>

          <button
            onClick={() => navigate('/notes')}
            className=""
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=""
        />

        <div className="line" />

        <textarea
          placeholder="Write something beautiful..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          className=""
        />

        <div className="footer">
          <span className="">Autosaved locally</span>

          <button
            onClick={handleSave}
            className="addbtn"
          >
            <Save size={16} />
            Save
          </button>
        </div>

      </div>
    </div>
  )
}

export default Add
