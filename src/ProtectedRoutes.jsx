import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoutes = () => {
    const navigate = useNavigate()

    const {isAuthenticated , justLoggedOut} = useSelector((state)=> state.auth)

    useEffect(()=>{
        
        if(!isAuthenticated){
            if(!justLoggedOut){

                toast.error("Please Login first.")
            }
            return navigate('/')
        }

    },[isAuthenticated])

    return <Outlet />
}

export default ProtectedRoutes