import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import '../Css/Add&Update.css'

const Update = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [values , setValues] = useState({
    title : "",
    content : ''
  })

  useEffect(()=>{
    async function fetchData(){
      try {
        const data = await window.api.getNotebyid({id : id})
        if(data.success){

          console.log(data.data)
          setValues({
            title : data.data.title,
            content : data.data.content
          })
        }else {
          console.log(data.error)
        }

      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  },[id])


  const handleSave = async ()=>{
    if(values.title === '' || values.content === ''){
      return toast.error("Enter both fields")
    }
    
    try {
      const updatedata = await window.api.editNote({title : values.title , content : values.content , id : id})

      if(updatedata.success){
        toast("Data Upated.")
        console.log(updatedata.data)
        navigate('/notes')
      }else {
        console.log(updatedata.error)
      }
    } catch (error) {
        console.error(error)
    }
  }

  return (
     <div className="container">
      <div className="box-container">

        <div className="header">
          <h1 className="">Update Note</h1>

          <button className="" onClick={()=> navigate('/notes')}>
            Cancel
          </button>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter note title..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.title}
              onChange={(e)=> setValues({...values , title : e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Content
            </label>
            <textarea
              rows="6"
              placeholder="Write your note here..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e)=> setValues({...values , content : e.target.value})}
              value={values.content}
            />
          </div>

          <div className="footer">
            <button className="updatebtn" onClick={handleSave}>
              Update Note
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Update