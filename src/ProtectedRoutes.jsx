import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoutes = () => {
    const navigate = useNavigate()

    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated)

    useEffect(()=>{
        
        if(!isAuthenticated){
            toast.error("Please Login first.")
            return navigate('/')
        }

    },[isAuthenticated])

    return <Outlet />
}

export default ProtectedRoutes