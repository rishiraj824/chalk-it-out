
import { GoogleLogin } from 'react-google-login';
import React, { useState, useEffect } from 'react';
import credentials from './config/credentials.json';



const Login = ({ handleLogin, isSignedIn = false } ) => {
  
 return isSignedIn ? null :<GoogleLogin
    clientId={credentials.web.client_id}
    buttonText="Sign In"
    onSuccess={handleLogin}
    redirectUri={credentials.web.redirect_uris}
    onFailure={handleLogin}
    cookiePolicy={'single_host_origin'}
  />
}

export default Login