const admin = require("firebase-admin");
const serviceAccount = require("./smartparking-14838-firebase-adminsdk-fbsvc-702c810515.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-firebase-project.firebaseio.com",
});

module.exports = admin;
