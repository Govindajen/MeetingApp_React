import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../assets/styles/message.css";

export default function Message () {
    
    const [message, setMessage] = useState('');
    const [wsControlleur, setWSControlleur] = useState(null);
    const user = useSelector((state) => state.auth.user);

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const [selectedChat, setSelectedChat] = useState(null);
    
    useEffect( () => {
        const ws = new WebSocket('ws://localhost:3002');
        
        ws.onopen = () => {
            ws.send(JSON.stringify({type: 'connection', userId: user.user.id}));
            setWSControlleur(ws)

            ws.onmessage = (message) => {
                const body = JSON.parse(message.data);
            
                if(body.type == 'connection') {
                        setUsers(body.users);
                } else if (body.type == 'newMessage') {
                    setMessages([...messages, {username: body.username, message: body.message}]);
                }
            }
        }

    

        return () => {
            ws.close();
        }
    }, [])

    const handleSendMessage = () => {
        if(message) {
            wsControlleur.send(JSON.stringify({type: 'newMessage', message: message, userId: user.user.id}));
        }
    }



    return (
        <div className="message-container">
            <div className="users-list">
                <h2>Users</h2>
                <ul>
                    {users.map( (user, index) => {

                       return ( 
                       <li key={index + user.username} onClick={() => setSelectedChat({id: user.id, username: user.username})}>
                            <p>{user.username}</p>
                        </li>
                        )
                    
                    
                    })}
                </ul>
            </div>
            <div className="chat-section">
                <h2>Chat</h2>
                {selectedChat ? (
                    <>
                        <label>
                            <p style={{'color': 'white'}}>
                                {selectedChat.username}
                                </p>


                            <ul>
                                {messages.forEach( (message, index) => {
                                    return (
                                        <li key={index + message.userId}>
                                            <p>{message.message}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit" onClick={handleSendMessage}>
                            Send
                        </button>
                    </>
                ) : (
                    <p>Select a User</p>
                )}
            </div>
        </div>
    )
}