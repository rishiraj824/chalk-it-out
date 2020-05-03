import React from 'react';
import Layout from './Layout';
import Button from './components/button';
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
    const viewId = new Date().getTime();
    return (<Layout>
            <div className="welcome">
                <h3>Start Live Teaching</h3>
                <Link to={`/teach/${viewId}`}><Button text="Let's Go!" /></Link>
            </div>
        </Layout>)
}

export default Home;
