import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userId")));

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userId"));
    setUser(userData);
  }, [user]);
  return (
    <div className='footer'>
      <div>
      <Link to='/allBlogs' className="card-title logo" href="#"><div className="card-title logo">social media</div></Link>
        <NavLink style={{ width: 'max-content' }} to='/allBlogs' className="nav-link" aria-current="page" href="#"> <HomeOutlinedIcon style={{height:'30px', width:'30px', cursor:'pointer'}}/></NavLink>
        <NavLink style={{ width: 'max-content' }} to='/Blogs' className="nav-link" aria-current="page" href="#"> <AddBoxOutlinedIcon style={{height:'30px', width:'30px', cursor:'pointer'}}/></NavLink>
        <NavLink style={{ width: 'max-content' }} to='/discover' className="nav-link" aria-current="page" href="#"><PersonAddAltOutlinedIcon style={{height:'30px', width:'30px', cursor:'pointer'}}/></NavLink>
        <NavLink style={{ width: 'max-content' }} to={`/user-profile/${user._id}`} className="nav-link" aria-current="page" href="#"><img src={user.profile? user.profile:'profilepicture'} alt="" /></NavLink>
      </div>
    </div>
  )
}
