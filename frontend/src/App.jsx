import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import { UserProvider } from './context/UserContext'
import Dashboard from './pages/Dashboard'
import CreateResumeForm from './components/CreateResumeForm'

const App = () => {
  return (
    <UserProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resume/:id' element={<CreateResumeForm />} />
      </Routes>
    </UserProvider>
  )
}

export default App