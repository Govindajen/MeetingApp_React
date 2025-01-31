import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers } from "../redux/slices/fetchSlice";
import './home.css'

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const bddUsers = useSelector((state) => state.users.allUsers);

  const [currentIndex, setCurrentIndex] = useState(0); // Track current user index

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <p>Please log in first...</p>;
  }

  const handleLike = () => {
    navigate("/chats");
  };

  const handleDislike = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bddUsers.length); // Move to next user
  };

  return (
<div className="tinder-container">
  <h2 className="tinder-title">🔥 Discover New Users</h2>

  {bddUsers.length > 0 ? (
    <div className="tinder-card">
      <h3 className="tinder-username">{bddUsers[currentIndex]?.username}</h3>
      <p className="tinder-info">📧 {bddUsers[currentIndex]?.email}</p>
      <p className="tinder-info">🎂 Age: {bddUsers[currentIndex]?.age || "N/A"}</p>
      <p className="tinder-info">💼 {bddUsers[currentIndex]?.profession || "N/A"}</p>
    </div>
  ) : (
    <p className="tinder-loading">Loading users...</p>
  )}

  <div className="tinder-buttons">
    <button onClick={handleDislike} className="tinder-btn dislike">❌ Nope</button>
    <button onClick={handleLike} className="tinder-btn like">💖 Like</button>
  </div>
</div>

  );
};

export default Home;
