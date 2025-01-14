import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // <-- Import the new CSS file

function Profile() {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [profile, setProfile] = useState({ username: "", bio: "", location: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // Handle changes for profile inputs
  const handleProfileChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    setProfile({ ...profile, [field]: value });
  };

  // Delete profile (Admin only)
  const deleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.user_id;
      const header = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://localhost:5000/profile/${userId}`, { headers: header });
      alert("Profile deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete profile. Please try again.");
    }
  };

  // Save profile updates
  const saveData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const header = { Authorization: `Bearer ${token}` };

      await axios.put(
        "http://localhost:5000/profile",
        {
          bio: profile.bio,
          location: profile.location,
        },
        { headers: header }
      );

      alert("Profile updated successfully!");
      setIsEditingBio(false);
      setIsEditingLocation(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id;
        const header = { Authorization: `Bearer ${token}` };

        // Fetch profile, posts, comments in parallel
        const [profileResponse, postsResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/profile/${userId}`, { headers: header }),
          axios.get(`http://localhost:5000/profile/${userId}/posts`, { headers: header }),
          axios.get(`http://localhost:5000/profile/${userId}/comments`, { headers: header }),
        ]);

        setProfile(profileResponse.data);
        setPosts(postsResponse.data);
        setComments(commentsResponse.data);

        if (decodedToken.position === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Failed to fetch profile. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Welcome, {profile.username}</h2>
        </div>

        {/* USERNAME */}
        <div className="info-group">
          <p className="info-title">Username</p>
          <p>{profile.username}</p>
        </div>

        {/* BIO */}
        <div className="info-group">
          <p className="info-title">Bio</p>
          {isEditingBio ? (
            <>
              <input
                name="bio"
                type="text"
                className="info-input"
                value={profile.bio}
                onChange={handleProfileChange}
              />
              <div className="button-group">
                <button className="save-button" onClick={saveData}>
                  Save Bio
                </button>
                <button className="cancel-button" onClick={() => setIsEditingBio(false)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{profile.bio}</p>
              <button className="edit-button" onClick={() => setIsEditingBio(true)}>
                Edit Bio
              </button>
            </>
          )}
        </div>

        {/* LOCATION */}
        <div className="info-group">
          <p className="info-title">Location</p>
          {isEditingLocation ? (
            <>
              <input
                name="location"
                type="text"
                className="info-input"
                value={profile.location}
                onChange={handleProfileChange}
              />
              <div className="button-group">
                <button className="save-button" onClick={saveData}>
                  Save Location
                </button>
                <button className="cancel-button" onClick={() => setIsEditingLocation(false)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{profile.location}</p>
              <button className="edit-button" onClick={() => setIsEditingLocation(true)}>
                Edit Location
              </button>
            </>
          )}
        </div>

        {/* POSTS */}
        <div className="posts-section">
          <h2>Posts</h2>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="post-card">
                <p>{post.content}</p>
              </div>
            ))
          ) : (
            <p>No Posts at this time</p>
          )}
        </div>

        {/* COMMENTS */}
        <div className="comments-section">
          <h2>Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="post-card">
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments at this time</p>
          )}
        </div>

        {/* DELETE PROFILE - ADMIN ONLY */}
        {isAdmin && (
          <button
            className="delete-button"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your profile?")) {
                deleteProfile();
              }
            }}
          >
            Delete Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
