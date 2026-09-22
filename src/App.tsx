import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CreateExperience } from './components/CreateExperience'
import { SharedExperience } from './components/SharedExperience'
import { YellowFlowerExperience } from './components/YellowFlowerExperience'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateExperience />} />
        <Route
          path="/experience"
          element={<YellowFlowerExperience finalImageUrl="/us.jpg" />}
        />
        <Route path="/g/:shareCode" element={<SharedExperience />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
