import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from './components/button';
import Input from './components/input';
import './Home.css';
import Layout from './Layout';

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [lectureName, setState] = useState('');
  const history = useHistory();
  let inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  const createLiveStream = async () => {
    try {
      const result = await fetch(API_URL, {
        method: 'post',
        body: JSON.stringify({
          user: document.cookie.get('oauth'),
        }),
      });
      history.push(
        `/teach/${lectureName}-${result.stream_key}?id=${result.id}`,
      );
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
