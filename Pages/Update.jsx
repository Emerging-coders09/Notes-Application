import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

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
     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Update Note</h1>

          <button className="text-sm text-gray-500 hover:bg-red-500 transition ease-in-out px-3 py-2 rounded-xl outline-none hover:text-white cursor-pointer" onClick={()=> navigate('/notes')}>
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

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md" onClick={handleSave}>
              Update Note
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Update