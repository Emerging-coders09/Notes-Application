import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Sign = () => {
    const navigate = useNavigate()
    const [values , setValues] = useState({
        name : '',
        email : '',
        password : '',
        confirmPassword : ''
    })

    const handleRegister = async ()=>{
      try {
        if (values.password !== values.confirmPassword) return alert("Passowrd and Confirm Password doesn't match")

        const register = await window.api.register({
            name : values.name,
            email : values.email,
            password : values.password
        })    

        console.log(register)

        if(register.success){
          console.log("User Added", register.data)
          toast.success("Register Successfully")
          navigate('/')
        }else {
          console.error("Error :" , register.error)
          toast.error(register.error)
        }
      } catch (error) {
        console.error(error)
      }
    }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-[400px] bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">Start organizing your notes</p>
        </div>

        <div className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={(e)=> setValues({...values , name : e.target.value})}
            />
          </div>

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
              placeholder="Create a password"
              className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={(e)=> setValues({...values , password : e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={(e)=> setValues({...values , confirmPassword : e.target.value})}
            />
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition" onClick={handleRegister}>
            Sign Up
          </button>
        </div>

        <p className="text-sm text-center text-gray-500">
          Already have an account? 
          <button className="text-blue-500 cursor-pointer ml-1" onClick={()=> navigate('/')}>
            Log in
          </button>
        </p>

      </div>
    </div>
  )
}

export default Sign