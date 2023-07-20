
import './App.css';
import { Route, Routes } from "react-router-dom";
import Sign from './components/Sign';
import Login from './components/Login';
import Blog from './components/Blog';
import GetAllBlogs from './components/GetAllBlogs';
import UpdateBlog from './components/UpdateBlog';
import PersonalBlogs from './components/PersonalBlogs';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Blogs" element={<Blog />} />
        <Route path="/allBlogs" element={<GetAllBlogs />} />
        <Route path="/single-blog/:_id" element={<UpdateBlog />} />
        <Route path="/PersonalBlogs" element={<PersonalBlogs />} />
      </Routes>
    </>
  );
}

export default App;