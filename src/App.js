import React, { Component } from "react";
import { withCookies } from "react-cookie";
import "./App.css";
import Home from "./Home";
import Login from "./Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        avatar: "https://i.pravatar.cc/50",
        name: "Anonymous",
      },
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    const isSignedIn = cookies.get("user") || false;
    if (isSignedIn) {
      this.setState({
        user: JSON.parse(localStorage.getItem("user")),
      });
    }
  }
  handleLogin = (response) => {
    const { cookies } = this.props;

    cookies.set("token", response.accessToken);

    localStorage.setItem(
      "user",
      JSON.stringify({
        avatar: response.profileObj && response.profileObj.imageUrl,
        name: response.profileObj && response.profileObj.name,
      })
    );

    this.setState({
      user: {
        avatar: response.profileObj && response.profileObj.imageUrl,
        name: response.profileObj && response.profileObj.name,
      },
    });
  };

  handleLogout = () => {
    const { cookies } = this.props;

    cookies.remove("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  render() {
    const { user } = this.state;
    const { cookies } = this.props;

    const isSignedIn = cookies.get("token") || false;

    return (
      <React.Fragment>
        {isSignedIn ? (
          <Home />
        ) : (
          <Login isSignedIn={isSignedIn} handleLogin={this.handleLogin} />
        )}
      </React.Fragment>
    );
  }
}

export default withCookies(App);
