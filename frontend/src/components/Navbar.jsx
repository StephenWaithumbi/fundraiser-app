import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      localStorage.removeItem('userId');  
      navigate('/');  
    })
    .catch(error => console.error('Error logging out:', error));
  };

  const handleProfileClick = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate('/signin'); 
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/campaigns">Campaigns</Link></li>
        {/* <li><a href="#" onClick={handleProfileClick}>Profile</a></li> */}
        <li><Link to="/start-campaign">Start a Fundraiser</Link></li>
        {/* <li><Link to="/signin">Login</Link></li> */}
        {/* <li><a href="#" onClick={handleLogout} className="logout">Logout</a></li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
