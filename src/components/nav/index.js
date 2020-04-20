import React from 'react';
import "./nav.css";
import GoogleLogout from 'react-google-login';
import credentials from '../../config/credentials.json';

const Nav = ({ user = { avatar: '', name: 'Anonymous' }, handleLogout, isSignedIn }) => (
    <div className="nav">
        <div className="ham">
        <div className="ham-lines"></div>
        <div className="ham-lines"></div>
        <div className="ham-lines"></div>
        </div>  
        <h3 className="Logo">Chalk It Out</h3>
        <div className="user">
            <h3 className="name">{user.name}</h3>
            <img className="avatar" src={user.avatar} />
        </div>
        {/*isSignedIn ? <GoogleLogout
            clientId={credentials.web.client_id}
            buttonText="Sign Out"
            onLogoutSuccess={handleLogout}
            className="logout"
        >
        </GoogleLogout> : ''*/}
    </div>
)

export default Nav;