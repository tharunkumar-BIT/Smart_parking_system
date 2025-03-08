const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const aedes = require('aedes');
const net = require('net');

const app = express();
const port = 3000;
const mqttPort = 1883;
const secretKey = 'your_secrettttt_keyyyyyyyyyyyyyy';

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'vishnu',
    password: 'vishnu',
    database: 'smartParking'
});

function handleDisconnect() {
    db.connect(err => {
        if (err) {
            console.error(`MySQL connection error: ${err.message}`);
            setTimeout(handleDisconnect, 5000); // Retry in 5 seconds
        } else {
            console.log('Connected to MySQL database!');
        }
    });
}

db.on('error', (err) => {
    console.error('MySQL error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
    } else {
        throw err;
    }
});

// MQTT Server Class
class MqttServer {
    constructor(port = mqttPort) {
        this.port = port;
        this.aedes = aedes();
        this.server = net.createServer(this.aedes.handle);
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Aedes MQTT server is running on port ${this.port}`);
        });

        this._setupEventListeners();
    }

    stop(callback) {
        this.server.close(() => {
            console.log('MQTT server stopped');
            if (callback) callback();
        });
    }

    publishLogUpdate(logData) {
        const topic = 'logs/updates';
        const payload = JSON.stringify(logData);
        this.aedes.publish({ topic, payload }, () => {
            console.log(`Published update to ${topic}`);
        });
    }

    _setupEventListeners() {
        this.aedes.on('client', (client) => console.log(`Client connected: ${client.id}`));
        this.aedes.on('clientDisconnect', (client) => console.log(`Client disconnected: ${client.id}`));

        this.aedes.on('publish', (packet, client) => {
            if (client) {
                const message = packet.payload.toString();
                try {
                    const data = JSON.parse(message);

                    if (data.email) {
                        const getUserQuery = 'SELECT id FROM user WHERE email = ?';
                        db.query(getUserQuery, [data.email], (err, userResults) => {
                            if (err) {
                                console.error(`Error fetching user: ${err.message}`);
                                return;
                            }

                            if (userResults.length === 0) {
                                console.warn(`User with email ${data.email} not found`);
                                return;
                            }

                            const userId = userResults[0].id;

                            const getLogQuery = 'SELECT * FROM log WHERE user_id = ? ORDER BY entry_timestamp DESC LIMIT 1';
                            db.query(getLogQuery, [userId], (err, logResults) => {
                                if (err) {
                                    console.error(`Error fetching log: ${err.message}`);
                                    return;
                                }

                                if (logResults.length > 0 && logResults[0].occupied === 1) {
                                    const updateLogQuery = 'UPDATE log SET occupied = 0, exit_timestamp = NOW() WHERE id = ?';
                                    db.query(updateLogQuery, [logResults[0].id], (err) => {
                                        if (err) {
                                            console.error(`Error updating log: ${err.message}`);
                                        } else {
                                            console.log(`Log updated for user ${data.email}: occupied set to 0`);

                                            this.publishLogUpdate({
                                                email: data.email,
                                                occupied: 0,
                                                exit_timestamp: new Date().toISOString()
                                            });
                                        }
                                    });
                                } else {
                                    const insertLogQuery = 'INSERT INTO log (user_id, entry_timestamp, occupied) VALUES (?, NOW(), 1)';
                                    db.query(insertLogQuery, [userId], (err) => {
                                        if (err) {
                                            console.error(`Error inserting log: ${err.message}`);
                                        } else {
                                            console.log(`New log created for user ${data.email}: occupied set to 1`);

                                            this.publishLogUpdate({
                                                email: data.email,
                                                occupied: 1,
                                                entry_timestamp: new Date().toISOString()
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        console.warn('Received JSON message does not contain an "email" field');
                    }
                } catch (error) {
                    console.warn(`Non-JSON message received from ${client.id} on topic ${packet.topic}:`, message);
                }
            }
        });
    }
}

// User Authentication and Authorization
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User created successfully' });
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM user WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Access denied, token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again.' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

function authorizeAdmin(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    next();
}

app.get('/protected', authenticateToken, authorizeAdmin, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}, this is a protected route.` });
});

app.get('/logs', authenticateToken, authorizeAdmin, (req, res) => {
    const query = `
        SELECT log.id, user.email, user.name, log.entry_timestamp, log.exit_timestamp, log.occupied 
        FROM log 
        JOIN user ON log.user_id = user.id 
        ORDER BY log.entry_timestamp DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start the servers
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const mqttServer = new MqttServer(mqttPort);
mqttServer.start();
