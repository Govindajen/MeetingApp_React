const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const User = require('./models/User');	

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const WebSocket = require('ws');
const ws = new WebSocket.Server({ port: 3002 });

let usersConnected = [];

ws.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		const body = JSON.parse(message);
		console.log(body.type);
		
		switch (body.type) {
			case 'connection':
				User.findOne({ _id: body.userId }).then(userDB => {
					const username = userDB.username;
					const userIndex = usersConnected.findIndex(user => user.id === body.userId);

					if (userIndex === -1) {
						usersConnected.push({ id: body.userId, username: username, ws: ws });
					} else {
						usersConnected[userIndex].ws = ws;
					}

					broadcast({ type: 'onlineUsers', users: usersConnected.map(user => ({ id: user.id, username: user.username })) });
				});
				break;
			// Add more cases here as needed
			case 'newMessage':
				usersConnected.forEach(connectedUser => {
					if (body.userId === connectedUser.id) {
						broadcast({ type: 'newMessage', message: body.message, username: connectedUser.username });
					}
				});
				break;
			// Add more cases here as needed
			case 'close':
				console.log('logout of user', body.userId);
				usersConnected = usersConnected.filter(user => user.id !== body.userId);
				broadcast({ type: 'onlineUsers', users: usersConnected.map(user => ({ id: user.id, username: user.username })) });
				break;
			// Add more cases here as needed
			default:
				console.log(`Unknown message type: ${body.type}`);
		}
	});
});

function broadcast(message) {
	usersConnected.forEach(user => {
		user.ws.send(JSON.stringify(message));
	});
}

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
	.catch(err => console.log(err));

const forumRoutes = require('./routes/forum');
app.use('/api/forum', forumRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
