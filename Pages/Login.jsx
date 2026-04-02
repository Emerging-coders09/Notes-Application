import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [values , setValues] = useState({
    email : '',
    password : ''
  })

  const handleLogin = async ()=>{
    const data = await window.api.login({
      email : values.email , 
      password : values.password
    })
    console.log(data)

  }

  const navigate = useNavigate()
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-[400px] bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800">NoteApp</h1>
          <p className="text-gray-500 text-sm">Organize your thoughts</p>
        </div>

        <div className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={(e)=> setValues({...values , email : e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={(e)=> setValues({...values , password : e.target.value})}
            />
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition" onClick={handleLogin}>
            Log In
          </button>
        </div>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account? <button className="text-blue-500 cursor-pointer" onClick={()=> navigate('/sign')}>Sign up</button> <button className="text-blue-500 cursor-pointer" onClick={()=> navigate('/notes')}>Notes</button>
        </p>

      </div>
    </div>
  )
}

export default Login