import React, { useState } from 'react';
import { withRouter } from "react-router";
import { Link, useHistory } from 'react-router-dom';
import Button from './components/button';
import Input from './components/input';
import "./Home.css";
import Layout from './Layout';

const Home = () => {
    const [state, setState] = useState(null);
    const history = useHistory();

    const createLiveStream = async () => {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Basic ${process.env.REACT_APP_MUX_TOKEN}`);

            const raw = JSON.stringify({"playback_policy":"public","new_asset_settings":{"playback_policy":"public"}});

            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("https://api.mux.com/video/v1/live-streams", requestOptions);
            const result = await response.text();
            console.log(result.stream_key)
            history.push(`/teach/${state}-${result.stream_key}?id=${result.id}`)

        } catch(err) {
            console.log(err);
        }
    }
    return (<Layout>
            <div className="welcome">
                <Input placeholder="What are you teaching?" value={state} onChange={(e)=>setState(e.target.value)}/>
                <h3>Start Live Teaching</h3>
                <Link onClick={createLiveStream} ><Button text="Let's Go!" /></Link>
            </div>
        </Layout>)
}

export default withRouter(Home);
