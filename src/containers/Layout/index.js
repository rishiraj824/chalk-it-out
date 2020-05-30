import React from 'react';
import Nav from '../../components/nav';
import './Layout.css';

const Layout = (props) => (
  <div className="container">
    <Nav /> {props.children}
  </div>
);

export default Layout;
