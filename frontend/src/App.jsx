// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./Upload";
import Status from "./Status";
import Result from "./Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/status/:jobId" element={<Status />} />
        <Route path="/result/:jobId" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
