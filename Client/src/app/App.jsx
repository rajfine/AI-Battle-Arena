import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArenaPage from '../pages/ArenaPage'
import ModelsPage from '../pages/ModelsPage'
import { BattleProvider } from '../context/BattleContext'

function App() {
  return (
    <BrowserRouter>
      <BattleProvider>
        <Routes>
          <Route path="/" element={<ArenaPage />} />
          <Route path="/models" element={<ModelsPage />} />
        </Routes>
      </BattleProvider>
    </BrowserRouter>
  )
}

export default App
