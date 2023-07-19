
import './App.css';
import { Route, Routes } from "react-router-dom";
import Sign from './components/Sign';
import Login from './components/Login';
import Blog from './components/Blog';
import GetAllBlogs from './components/GetAllBlogs';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Blogs" element={<Blog />} />
        <Route path="/allBlogs" element={<GetAllBlogs />} />
      </Routes>
    </>
  );
}

export default App;
