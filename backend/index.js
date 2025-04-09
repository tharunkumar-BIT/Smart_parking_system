require("dotenv").config(); // Load .env variables
const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const aedes = require("aedes");
const net = require("net");
const cors = require("cors");
const http = require("http");
const ws = require("websocket-stream");

const app = express();
const port = 3000;;
const mqttPort = 1883;
const secretKey = "your_secrettttt_keyyyyyyyyyyyyyy";

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartparking",
});

db.connect((err) => {
  if (err) {
    console.error(`MySQL connection error: ${err.message}`);
    setTimeout(() => db.connect(), 5000); // Retry in 5 seconds
  } else {
    console.log("Connected to MySQL database!");
  }
});

db.on("error", (err) => {
  console.error("MySQL error", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    db.connect();
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

  publishLogUpdate(logData) {
    const topic = "logs/updates";
    const payload = JSON.stringify(logData);
    this.aedes.publish({ topic, payload }, () => {
      console.log(`Published update to ${topic}`);
    });
  }

  _setupEventListeners() {
    this.aedes.on("publish", (packet, client) => {
      if (client) {
        const message = packet.payload.toString();
        try {
          const data = JSON.parse(message);

          if (data.email) {
            db.query(
              "SELECT id FROM user WHERE email = ?",
              [data.email],
              (err, userResults) => {
                if (err || userResults.length === 0) {
                  console.error("Error fetching user data:", err);
                  return;
                }
                const userId = userResults[0].id;
                db.query(
                  "SELECT * FROM log WHERE user_id = ? ORDER BY entry_timestamp DESC LIMIT 1",
                  [userId],
                  (err, logResults) => {
                    if (err) {
                      console.log("DataBase error");
                      return;
                    }
                    if (logResults.length > 0 && logResults[0].occupied) {
                      db.query(
                        "UPDATE log SET occupied = 0, exit_timestamp = NOW() WHERE id = ?",
                        [logResults[0].id],
                        () => {
                          this.publishLogUpdate({
                            email: data.email,
                            occupied: 0,
                            exit_timestamp: new Date().toISOString(),
                          });
                        }
                      );
                    } else {
                      db.query(
                        "INSERT INTO log (user_id, entry_timestamp, occupied) VALUES (?, NOW(), 1)",
                        [userId],
                        () => {
                          this.publishLogUpdate({
                            email: data.email,
                            occupied: 1,
                            entry_timestamp: new Date().toISOString(),
                          });
                        }
                      );
                    }
                  }
                );
              }
            );
          }
        } catch (error) {
          console.warn(
            `Non-JSON message received on topic ${packet.topic}:`,
            message
          );
        }
      }
    });
  }
}

// Enable WebSockets for MQTT
const httpServer = http.createServer(app);
ws.createServer({ server: httpServer }, aedes().handle);
httpServer.listen(9001, () => {
  console.log("MQTT WebSocket server is running on port 9001");
});

// User Authentication and Authorization
app.post("/signup", async (req, res) => {
  const { name, email, password, carNumber, phoneNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO user (name, email, password, car_number, phone_number) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, carNumber, phoneNumber],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });
      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        secretKey,
        { expiresIn: "1h" }
      );
      res.json({ token });
    }
  );
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(403)
      .json({ message: "Access denied, token missing or invalid" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  const email = req.user.email;

  db.query(
    "SELECT id, name, email, isAdmin, car_number FROM user WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User Data Sent:", results[0]); // Debugging
      res.json(results[0]); // Ensure 'id' is included
    }
  );
});

app.get("/logs", authenticateToken, (req, res) => {
  const userId = req.query.user_id;
  db.query("SELECT * FROM log ", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result); // Send logs data
  });
});

// Start the servers
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const mqttServer = new MqttServer(mqttPort);
mqttServer.start();
