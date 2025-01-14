import React, { useState, useEffect } from "react";
import axios from "axios";
import TextInputWithButton from "./TextInputWithButton";
import "./Dashboard.css"; // <-- Import the new CSS

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  // States for creating a new post
  const [newPostContent, setNewPostContent] = useState("");
  const [showPost, setShowPostInput] = useState(false);

  // States for editing a post (per-post approach)
  const [editPostId, setEditPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");

  // For toggling “New Comment”
  const [createCommentPostId, setCreateCommentPostId] = useState(null);
  const [createCommentText, setCreateCommentText] = useState("");

  // For updating comment
  const [updateCommentContent, setCommentPost] = useState("");
  const [showUpdateComment, setShowUpdateComment] = useState(false);

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Please try logging in again.");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(decodedToken.position === "admin");

        // Fetch posts
        const postsResponse = await axios.get("http://localhost:5000/posts");
        setPosts(postsResponse.data);

        // Fetch comments for each post
        const newComments = {};
        for (let i = 0; i < postsResponse.data.length; i++) {
          const post_id = postsResponse.data[i].id;
          try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(
              `http://localhost:5000/posts/${post_id}/comments`,
              { headers }
            );
            newComments[post_id] = response.data;
          } catch (error) {
            console.error(
              `Failed to fetch comments for post ${post_id}:`,
              error.response?.data || error.message
            );
          }
        }
        setComments(newComments);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Failed to fetch posts and comments. Please try again.");
      }
    };
    fetchPostsAndComments();
  }, []);

  // -----------------------------
  //         CREATE POST
  // -----------------------------
  const createPost = async (content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        "http://localhost:5000/posts",
        { content },
        { headers }
      );

      // Update local state
      setPosts((prev) => [...prev, response.data]);
      setComments((prev) => ({
        ...prev,
        [response.data.id]: [],
      }));
      alert("Post created successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to create a new post.");
    }
  };

  // -----------------------------
  //         UPDATE POST
  // -----------------------------
  const updatePost = async (post_id, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `http://localhost:5000/posts/${post_id}`,
        { content },
        { headers }
      );

      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === post_id ? { ...p, content } : p))
      );
      alert("Post updated successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update the post.");
    }
  };

  // -----------------------------
  //         DELETE POST
  // -----------------------------
  const deletePost = async (post_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/posts/${post_id}`, { headers });

      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post_id));
      setComments((prevComments) => {
        const updated = { ...prevComments };
        delete updated[post_id];
        return updated;
      });
      alert("Post and its comments deleted successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete post.");
    }
  };

  // -----------------------------
  //     CREATE COMMENT
  // -----------------------------
  const createComment = async (post_id, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `http://localhost:5000/posts/${post_id}/comments`,
        { content },
        { headers }
      );

      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        if (!updatedComments[post_id]) {
          updatedComments[post_id] = [];
        }
        updatedComments[post_id].push(response.data);
        return updatedComments;
      });
      alert("Comment created successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to create comment. Please try again.");
    }
  };

  // -----------------------------
  //     UPDATE COMMENT
  // -----------------------------
  const updateComment = async (comment_id, post_id, newContent) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `http://localhost:5000/comments/${comment_id}`,
        { content: newContent },
        { headers }
      );

      setComments((prev) => {
        const newComments = { ...prev };
        const postComments = [...(newComments[post_id] || [])];

        for (let i = 0; i < postComments.length; i++) {
          if (postComments[i].id === comment_id) {
            postComments[i] = {
              ...postComments[i],
              content: newContent,
            };
            break;
          }
        }
        newComments[post_id] = postComments;
        return newComments;
      });
      alert("Comment updated successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update comment. Please try again.");
    }
  };

  // -----------------------------
  //     DELETE COMMENT
  // -----------------------------
  const deleteComment = async (comment_id, post_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/comments/${comment_id}`, { headers });

      setComments((prev) => {
        const newComments = { ...prev };
        const postComments = newComments[post_id] || [];

        const updatedComments = [];
        for (let i = 0; i < postComments.length; i++) {
          if (postComments[i].id !== comment_id) {
            updatedComments.push(postComments[i]);
          }
        }
        newComments[post_id] = updatedComments;
        return newComments;
      });
      alert("Comment deleted successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete comment. Please try again.");
    }
  };

  // -----------------------------
  //           Render
  // -----------------------------
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        {/* Create Post Section */}
        <div className="create-post-section">
          {showPost ? (
            <TextInputWithButton
              value={newPostContent}
              onChange={setNewPostContent}
              onSave={() => {
                setShowPostInput(false);
                createPost(newPostContent);
              }}
              buttonLabel="Create Post"
            />
          ) : (
            <button
              className="create-post-button"
              onClick={() => {
                setShowPostInput(true);
                setNewPostContent("");
              }}
            >
              Create Post
            </button>
          )}
        </div>

        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2 className="post-content">{post.content}</h2>
              {/* Post Actions */}
              <div className="post-actions">
                {editPostId === post.id ? (
                  <TextInputWithButton
                    value={editPostContent}
                    onChange={(text) => setEditPostContent(text)}
                    onSave={() => {
                      updatePost(post.id, editPostContent);
                      setEditPostId(null);
                      setEditPostContent("");
                    }}
                    buttonLabel="Save Post"
                  />
                ) : (
                  <button
                    className="post-button update"
                    onClick={() => {
                      setEditPostId(post.id);
                      setEditPostContent(post.content);
                    }}
                  >
                    Update Post
                  </button>
                )}

                {isAdmin && (
                  <button
                    className="post-button delete"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete Post
                  </button>
                )}
              </div>

              {/* Comments Section */}
              {comments[post.id]?.length > 0 ? (
                <div className="comments-section">
                  <h3 className="comments-title">Comments</h3>
                  {comments[post.id].map((comment) => (
                    <div key={comment.id} className="comment-card">
                      <h4 className="comment-content">{comment.content}</h4>
                      <div className="comment-actions">
                        {showUpdateComment ? (
                          <TextInputWithButton
                            value={updateCommentContent}
                            onChange={(text) => setCommentPost(text)}
                            onSave={() => {
                              setShowUpdateComment(false);
                              updateComment(
                                comment.id,
                                post.id,
                                updateCommentContent
                              );
                            }}
                            buttonLabel="Save Comment"
                          />
                        ) : (
                          <button
                            className="comment-button update"
                            onClick={() => {
                              setShowUpdateComment(true);
                              setCommentPost(comment.content);
                            }}
                          >
                            Update
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            className="comment-button delete"
                            onClick={() =>
                              deleteComment(comment.id, post.id)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <h4 className="no-content">No Comments for this post</h4>
              )}

              {/* Create New Comment Button */}
              {createCommentPostId === post.id ? (
                <TextInputWithButton
                  value={createCommentText}
                  onChange={(val) => setCreateCommentText(val)}
                  onSave={() => {
                    createComment(post.id, createCommentText);
                    setCreateCommentPostId(null);
                    setCreateCommentText("");
                  }}
                  buttonLabel="Create Comment"
                />
              ) : (
                <button
                  className="create-post-button"
                  onClick={() => {
                    setCreateCommentPostId(post.id);
                    setCreateCommentText("");
                  }}
                >
                  New Comment
                </button>
              )}
            </div>
          ))
        ) : (
          <h2 className="no-content">No Posts at this time</h2>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
