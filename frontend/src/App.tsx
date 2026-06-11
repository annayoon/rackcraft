import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BomPage from './pages/BomPage'
import RackPage from './pages/RackPage'
import PowerPage from './pages/PowerPage'
import DiagramPage from './pages/DiagramPage'

const qc = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <div className="app">
          <nav className="sidebar">
            <div className="logo">⚡ RackCraft</div>
            <NavLink to="/">BOM</NavLink>
            <NavLink to="/rack">Rack</NavLink>
            <NavLink to="/power">Power</NavLink>
            <NavLink to="/diagram">Diagram</NavLink>
          </nav>
          <main className="content">
            <Routes>
              <Route path="/" element={<BomPage />} />
              <Route path="/rack" element={<RackPage />} />
              <Route path="/power" element={<PowerPage />} />
              <Route path="/diagram" element={<DiagramPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
