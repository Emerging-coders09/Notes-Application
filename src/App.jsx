import React from 'react'
import {  Route, Routes, HashRouter } from 'react-router-dom'
import Login from '../Pages/Login'
import Sign from '../Pages/Sign'
import Add from '../Pages/Add'
import Update from '../Pages/Update'
import './App.css'
import Notes from '../Pages/Notes'
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <HashRouter>
      <Routes>

        <Route path='/' element={<Login />}/>
        <Route path='/sign'  element={<Sign />}/>
        <Route path='/add' element={<Add />}/>
        <Route path='/update/:id' element={<Update />}/>
        <Route path='/notes' element={<Notes />}/>

      </Routes>
    </HashRouter>
    </>
  )
}

export default App