import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";

async function loginUser(credentials) {
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("username", username);
    console.log("pass", password);
    console.log("e", e);
    if (password !== "abcd" || username !== "root") {
      alert("wrong credentials!!!");
    } else {
      // make API call
      const token = await loginUser({
        username,
        password,
      });
      setToken(token);
    }
  };

  return (
    <div className="login-wrapper">
      <br />
      <h1>Web Enabled App System for Health Data Analysis (WEASHDA V1)</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <br />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
