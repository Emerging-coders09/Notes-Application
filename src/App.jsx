import React from 'react'
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom'
import Login from '../Pages/Login'
import Sign from '../Pages/Sign'
import Add from '../Pages/Add'
import Update from '../Pages/Update'
import './App.css'
import Notes from '../Pages/Notes'

const App = () => {
  return (
    <>
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