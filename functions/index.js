/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors");
const express = require("express");

admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));

// Middleware to check authentication
async function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send("Invalid or expired token");
  }
}

// Fetch emails from Gmail API
app.get("/fetchEmails", checkAuth, async (req, res) => {
  try {
    const { user_id } = req.user;
    const accessToken = req.headers["gmail-access-token"]; // Pass from frontend

    if (!accessToken) {
      return res.status(400).json({ error: "Missing Gmail access token" });
    }

    // Fetch emails from Gmail API
    const response = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=newer_than:1d",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching emails:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

exports.api = functions.https.onRequest(app);



const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
