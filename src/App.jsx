import React from 'react'
import {  Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './Pages/Login'
import Sign from './Pages/Sign'
import Add from './Pages/Add'
import Update from './Pages/Update'
import './App.css'
import Notes from './Pages/Notes'
import { Toaster } from "react-hot-toast";
import Favourite from './Pages/Favourite'
import Recycle from './Pages/Recycle'
import ProtectedRoutes from './ProtectedRoutes'
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/sign'  element={<Sign />}/>
        <Route element={<ProtectedRoutes />}>

        <Route path='/add' element={<Add />}/>
        <Route path='/update/:id' element={<Update />}/>
        <Route path='/notes' element={<Notes />}/>
        <Route path='/favourite' element={<Favourite />}/>
        <Route path='/recycle' element={<Recycle />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App