import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./message.css"

export default function Chat() {
    const navigate = useNavigate();
    const [wsControlleur, setWSControlleur] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])


    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3002");

        ws.onopen = () => {
            setWSControlleur(ws);
            ws.send(JSON.stringify({ type: "connection", userId: user.user.id }));

            ws.onmessage = (message) => {
                const body = JSON.parse(message.data);
                if (body.type === "onlineUsers") {
                    setOnlineUsers(body.users);
                }

                if (body.type == 'newMessage') {
                    setMessages((prevMessages) => [...prevMessages, { message: body.message, username: body.username, with: body.with }]);
                }
            };
        };

        // Handle cleanup when the component unmounts or the user navigates away
        const closeWebSocket = () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "close", userId: user.user.id }));
                ws.close();
            }
        };

        window.addEventListener("beforeunload", closeWebSocket); // Close WS on browser refresh

        return () => {
            closeWebSocket();
            window.removeEventListener("beforeunload", closeWebSocket);
        };
    }, [user.user.id]);



    const handleSendMessage = () => {
        wsControlleur.send(JSON.stringify({ type: "newMessage", userId: user.user.id, message: newMessage, with: selectedUser }));
        setNewMessage('');
        console.log(messages)
    }

    const myMessage = messages
    .filter(
      (message) =>
        selectedUser &&
        ((message.username === user.user.username && message.with.id === selectedUser.id) ||
        (message.username === selectedUser.username && message.with.id === user.user.id))
    )
    .map((message, index) => (
      <div
        key={message.username + index}
        className={message.username === user.user.username ? "my-message" : "my-message2"}
      >
        {message.username !== user.user.username && (
          <p className="username">{message.username[0].toUpperCase()}</p>
        )}
        <span className="message">{message.message}</span>
        {message.username === user.user.username && <p className="username">ME</p>}
      </div>
    ));
  
  

    return (
        <div className="chat-container">
            <div className="chat-card">
                <div className="chat-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
                </div>
                <div className="chat-body">
                    <div className="users-list">
                        <h2>Online Users</h2>
                        {onlineUsers.length > 0 ? (
                            <ul className="users-list-ul">
                                {onlineUsers.map((onlineUser, index) => {

                                    if( onlineUser.username == user.user.username) return null;

                                    return (
                                    <li key={index} className="user-item" onClick={ () => {setSelectedUser(onlineUser)}} >
                                        {onlineUser.username}
                                    </li>
                                )})}
                            </ul>
                        ) : (
                            <p className="no-users">No users online...</p>
                        )}
                    </div>

                    <div className="chat-box">
                        {
                            (selectedUser) ? (
                                <h2>
                                    Chat with <span style={onlineUsers.filter( (user) => user.id == selectedUser.id) && {'color': '#ff006a'}}>{selectedUser.username}</span> 
                                </h2>
                            ) :
                            (
                                <h2>Chat</h2>
                            )
                        }
                        {
                            (selectedUser) ? (
                                <div className="chat-messages">
                                {selectedUser && myMessage}
                                </div>
                            )
                            :
                            (
                                <p>Start a conversation with an online user.</p>
                            )
                        }
                        <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            disabled={!selectedUser}
                        />
                        <button className="send-btn" onClick={handleSendMessage} disabled={!selectedUser}>
                            ➤
                        </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
