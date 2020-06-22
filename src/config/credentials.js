const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;

export default {
  web: {
    client_id: CLIENT_ID,
    project_id: 'chalk-it-out',
    client_secret: CLIENT_SECRET,
    redirect_uris: [CLIENT_URL],
  },
};
