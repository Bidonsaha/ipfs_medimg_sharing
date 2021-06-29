import React, { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Report from "../Report/Report";
import Login from "../Login/Login";
import Preferences from "../Preferences/Preferences";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import useToken from "./useToken";

// function setToken(userToken) {
//   sessionStorage.setItem("token", JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem("token");
//   const userToken = JSON.parse(tokenString);
//   //   return userToken?.token;

//   return userToken == null ? void 0 : userToken.token;
// }<h1>Application</h1>
{
  /* <BrowserRouter>
<Switch>
  <Route path="/dashboard">
    <Dashboard />
  </Route>
  <Route path="/preferences">
    <Preferences />
  </Route>
</Switch>
</BrowserRouter> */
}

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }
  return (
    <div className="wrapper">
      <h1>Web Enabled App System for Health Data Analysis (WEASHDA V1)</h1>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">TEZPUR UNIVERSITY</Navbar.Brand>
        <Nav className="mr-auto">
          <LinkContainer to="/dashboard">
            <Nav.Link>Dashboard</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/preferences">
            <Nav.Link>Preference</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/report">
            <Nav.Link>Sumbit Report</Nav.Link>
          </LinkContainer>
          {/* <Nav.Link>About the project</Nav.Link>
          <Nav.Link>Team</Nav.Link> */}
        </Nav>
      </Navbar>
      {/* <h1>Application</h1> */}
      {/* <BrowserRouter> */}
      <Switch>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/preferences">
          <Preferences />
        </Route>
        <Route path="/report">
          <Report />
        </Route>
      </Switch>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
