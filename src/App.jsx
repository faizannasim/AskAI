import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Components
import Home from "./Component/Home"
import API from "./Component/API"

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Chat page */}
        <Route path="/chat" element={<API />} />
      </Routes>
    </Router>
  )
}

export default App
