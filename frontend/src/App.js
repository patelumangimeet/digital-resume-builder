import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Resumes from './pages/Resumes';
import CreateResume from './pages/CreateResume';
import EditResume from './pages/EditResume';
import ViewResume from './pages/ViewResume';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Resumes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/resumes/create" element={<CreateResume />} />
        <Route path="/resumes/:id" element={<ViewResume />} />
        <Route path="/resumes/:id/edit" element={<EditResume />} />
      </Routes>
    </Router>
  );
}

export default App;
