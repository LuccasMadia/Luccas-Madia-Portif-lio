import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProjectsPage } from './pages/ProjectsPage';
import { PixPage } from './pages/PixPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projetos" element={<ProjectsPage />} />
        <Route path="/pix/:id" element={<PixPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
