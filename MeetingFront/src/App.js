import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/login';
import Register from './pages/register';
import Chat from './pages/chat';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/chats" element={<Chat />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;