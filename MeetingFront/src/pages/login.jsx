import axios from "axios";
import React, { useState ,useEffect} from "react";
import { useNavigate,Link } from "react-router-dom";
import './Login.css'
import { login } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const auth = useSelector((state)=>state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({email,password}))
    
    
  };


  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/home", { replace: true }); 
    }
  }, [auth.isAuthenticated, navigate]);
  
  
  return (
    <div className="login">
    <div class="login-container">
      <h1>Login</h1>
      <input
        type="text"
        
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button  onClick={handleLogin}>Login</button>
      <p>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2575fc" }}>
            Register here
          </Link>
        </p>
    </div>
    </div>
  );
};

export default Login;
