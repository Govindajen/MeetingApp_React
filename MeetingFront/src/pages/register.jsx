import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css'
import { register } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const auth = useSelector((state)=>state.auth);
  

  const handleRegister = (e) => {
   e.preventDefault();
   dispatch(register({username: username,email: email,password: password}))
  };


  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/home", { replace: true }); // Ensures history stack is updated safely
    }
  }, [auth.isAuthenticated, navigate]); // Depend on isAuthenticated, not user
  

  return (
    <div className="register">
      <div className="register-container">
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Register;
