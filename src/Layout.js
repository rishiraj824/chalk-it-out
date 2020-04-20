import React from 'react';
import Nav from './components/nav';

const Layout = (props) => <div className="container"><Nav /> {props.children}</div>

export default Layout;