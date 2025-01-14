import React, { useState } from "react";
import axios from "axios";
import "./Signup.css"; // <-- Import the CSS file

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleBio = (e) => setBio(e.target.value);
  const handleLocation = (e) => setLocation(e.target.value);

  const handleData = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
      bio,
      location,
      role: "user",
    };
    try {
      const response = await axios.post("http://localhost:5000/signup", data);
      alert("Submitted Successfully");
      console.log(response.data);
      window.location.href = "/login";
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.error || "Error during signup. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Optional header or branding section */}
        <div className="signup-header">
          <h2>Create an Account</h2>
          <p>Join us today. It's quick and easy!</p>
        </div>

        <form onSubmit={handleData}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={handleUsername}
              required
              minLength="6"
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={handlePassword}
              required
              minLength="6"
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="form-label">
              Bio
            </label>
            <input
              id="bio"
              type="text"
              className="form-input"
              value={bio}
              onChange={handleBio}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="form-input"
              value={location}
              onChange={handleLocation}
            />
          </div>

          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
