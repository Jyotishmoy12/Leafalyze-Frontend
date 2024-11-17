import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Analysis from "./components/Analysis";


const App=()=>{
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Analysis" element={<Analysis/>}/>
      </Routes>
    </Router>
  )
}

export default App