import React from 'react';
import { useParams } from 'react-router-dom';
import { Player } from 'video-react';
import HLSSource from '../../components/hls';
import Layout from '../Layout';

const MUX_STREAM = process.env.REACT_APP_MUX_STREAM;

const View = () => {
  const params = useParams();
  const { id } = params;

  if (id) {
    return (
      <Layout>
        <Player>
          <HLSSource isVideoChild src={`${MUX_STREAM}/${id}.m3u8`} />
        </Player>
      </Layout>
    );
  }

  return (
    <Layout>
      <h3>
        {' '}
        The Stream URL seems to be corrupted, please check again.{' '}
      </h3>
    </Layout>
  );
};

export default View;
