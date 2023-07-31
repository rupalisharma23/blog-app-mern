import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { NavLink, Link } from 'react-router-dom';

export default function Footer() {
    let user = JSON.parse(localStorage.getItem("userId"));
  return (
    <div className='footer'>
      <div>
      <Link to='/allBlogs' className="card-title logo" href="#"><div className="card-title logo">instagram</div></Link>
        <NavLink style={{ width: 'max-content' }} to='/allBlogs' className="nav-link" aria-current="page" href="#"> <HomeOutlinedIcon style={{height:'30px', width:'30px', cursor:'pointer'}}/></NavLink>
        <NavLink style={{ width: 'max-content' }} to='/Blogs' className="nav-link" aria-current="page" href="#"> <AddBoxOutlinedIcon style={{height:'30px', width:'30px', cursor:'pointer'}}/></NavLink>
        <NavLink style={{ width: 'max-content' }} to='/discover' className="nav-link" aria-current="page" href="#"><PersonAddAltOutlinedIcon style={{height:'30px', width:'30px', cursor:'pointer'}}/></NavLink>
        <NavLink style={{ width: 'max-content' }} to={`/user-profile/${user._id}`} className="nav-link" aria-current="page" href="#"><img src={user.profile? user.profile:'profilepicture'} alt="" /></NavLink>
      </div>
    </div>
  )
}