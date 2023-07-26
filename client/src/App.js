
import './App.css';
import { Route, Routes } from "react-router-dom";
import Sign from './components/Sign';
import Login from './components/Login';
import Blog from './components/Blog';
import GetAllBlogs from './components/GetAllBlogs';
import UpdateBlog from './components/UpdateBlog';
import PersonalBlogs from './components/PersonalBlogs';
import DiscoverPeople from './components/DiscoverPeople';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

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
        <Route path="/discover" element={<DiscoverPeople />} />
        <Route path="/user-profile/:_id" element={<UserProfile />} />
        <Route path="/fogot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:_id/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
