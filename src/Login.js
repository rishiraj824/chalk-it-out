
import { GoogleLogin } from 'react-google-login';
import React from 'react';
import credentials from './config/credentials.json';
import logo from "./logo.svg";

const Login = ({ handleLogin } ) => {
  
 return <div className="login">
 <img src={logo} alt="logo" className="logo" />
 <h3>Chalk It Out.</h3>
 <GoogleLogin
    clientId={credentials.web.client_id}
    buttonText="Sign In"
    onSuccess={handleLogin}
    redirectUri={credentials.web.redirect_uris}
    onFailure={handleLogin}
    cookiePolicy={'single_host_origin'}
  />
 </div>
}

export default Login