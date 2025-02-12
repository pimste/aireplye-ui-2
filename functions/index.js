/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const cors = require("cors")({ origin: true }); // Allow all origins for testing
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.fetchEmails = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Ensure request has a valid authorization header
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log("Authenticated user:", decodedToken.uid);

      // Your logic to fetch emails...
      res.json({ emails: [] }); // Placeholder response

    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(403).json({ error: "Unauthorized" });
    }
  });
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
