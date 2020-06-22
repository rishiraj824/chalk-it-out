import React from 'react';
import './nav.css';

const Nav = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {
    avatar: 'https://i.pravatar.cc/50',
    name: 'Anonymous',
  };
  return (
    <div className="nav">
      <div className="ham">
        <div className="ham-lines"></div>
        <div className="ham-lines"></div>
        <div className="ham-lines"></div>
      </div>
      <h3 className="logo-nav">
        <span className="logo-nav-text">Chalk It Out</span>
      </h3>
      <div className="user">
        <h3 className="name">{user.name}</h3>
        <img className="avatar" src={user.avatar} />
      </div>
    </div>
  );
};

export default Nav;
