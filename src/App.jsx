import { BrowserRouter, Routes, Route } from 'react-router-dom'
import QrGenerator from './QrGenerator'
import StaffValidate from './StaffValidate'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QrGenerator />} />
        <Route path="/staff" element={<StaffValidate />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
