import React from 'react'
import { Route,Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import { UserProvider } from './context/UserContext'
import Dashboard from './pages/Dashboard'
const App = () => {
    return(
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    )
}

export default App