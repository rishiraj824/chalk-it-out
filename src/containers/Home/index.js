import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import Button from '../../components/button';
import Input from '../../components/input';
import Layout from '../Layout';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [lectureName, setState] = useState('');
  const history = useHistory();
  let inputRef = useRef(null);

  const [cookies] = useCookies(['token']);

  const token = cookies.token;
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    inputRef.current.focus();
  });

  const createLiveStream = async () => {
    try {
      const response = await fetch(`${API_URL}/live-stream`, {
        method: 'post',
        body: JSON.stringify({
          user,
        }),
      });
      const result = await response.json();
      
      if (typeof result.data.stream_key !== 'undefined') {
        history.push(
          `/teach/${lectureName}/${result.data.stream_key}/${result.data.id}?playback_id=${result.data.playback_ids[0].id}`,
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Layout>
      <div className="welcome">
        <h3>Start Live Teaching</h3>
        <Input
          ref={inputRef}
          placeholder="What are you teaching today?"
          value={lectureName}
          onChange={(e) => setState(e.target.value)}
        />
        <Button
          onClick={createLiveStream}
          disabled={!lectureName}
          text="Let's Go!"
        />
      </div>
    </Layout>
  );
};

export default Home;
