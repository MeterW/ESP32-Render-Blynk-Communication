// index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Render sets the PORT environment variable

// Middleware to parse JSON bodies, which is how our ESP32 will send data
app.use(express.json());

// In-memory "database" to keep it simple
let lastReceivedData = { value: null, timestamp: null };
let systemStatus = { message: "System is running perfectly!" };

// Endpoint for the ESP32 to POST its data
app.post("/data", (req, res) => {
  const { sensorValue } = req.body;

  if (sensorValue === undefined) {
    return res
      .status(400)
      .send({ error: "Missing sensorValue in request body" });
  }

  lastReceivedData = {
    value: sensorValue,
    timestamp: new Date().toISOString(),
  };

  console.log("Received data:", lastReceivedData);
  res
    .status(200)
    .send({ message: "Data received successfully", data: lastReceivedData });
});

// Endpoint for the ESP32 to GET the system status
app.get("/status", (req, res) => {
  console.log("Status requested. Sending:", systemStatus);
  res.status(200).json(systemStatus);
});

// A root endpoint to check if the server is alive in a browser
app.get("/", (req, res) => {
  res.send(
    "ESP32 to Render.com API is running! Last data: " +
      JSON.stringify(lastReceivedData)
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
