import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProjectsPage } from './pages/ProjectsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projetos" element={<ProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
