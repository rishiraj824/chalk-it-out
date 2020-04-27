import React, { Component } from 'react';
import Login from './Login';
import './App.css';
import Blackboard from './Blackboard';

class  App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        avatar: 'https://i.pravatar.cc/50',
        name: 'Anonymous'
      },
      isSignedIn: false
    }
  }

  componentDidMount() {
    const isSignedIn = document.cookie;
    if(isSignedIn) {
      this.setState({
        isSignedIn,
        user: JSON.parse(localStorage.getItem('user')) || {
          avatar: 'https://i.pravatar.cc/50',
          name: 'Anonymous'
        }
      })
    }
  }
  handleLogin = (response) => {
    localStorage.setItem('user', JSON.stringify({
      avatar: response.profileObj && response.profileObj.imageUrl,
      name: response.profileObj && response.profileObj.name
    }))
      this.setState({
        user: {
          avatar: response.profileObj && response.profileObj.imageUrl,
          name: response.profileObj && response.profileObj.name
        },
      })
  }

  handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  }

  render() {
    const { user, isSignedIn } = this.state;
    return (
      <React.Fragment>
        {isSignedIn?<Blackboard user={user}/>:<Login isSignedIn={isSignedIn} handleLogin={this.handleLogin} />}
      </React.Fragment>
    );
  }
}

export default App;
