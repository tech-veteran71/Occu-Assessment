const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;
const filePath = path.join(__dirname, "datasets.json");

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.get("/api/statuses", (req, res) => {
  const statuses = Array.from({ length: 37 }, (_, i) => ({
    id: i + 1,
    status: ["fail", "warn", "pass"][Math.floor(Math.random() * 3)],
  }));
  res.json(statuses);
});

// Read the JSON file
const readFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return []; // Return an empty array if the file doesn't exist
  }
};

// Write to the JSON file
const writeFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to file", err);
  }
};

// Get all datasets
app.get("/api/datasets", (req, res) => {
  const datasets = readFile();
  res.json(datasets);
});

// Create a new dataset
app.post("/api/datasets", (req, res) => {
  const datasets = readFile();
  const newDataset = { ...req.body, id: datasets.length + 1 };
  datasets.push(newDataset);
  writeFile(datasets);
  res.json(newDataset);
});

// Update an existing dataset
app.put("/api/datasets/:id", (req, res) => {
  const datasets = readFile(); // Read the current datasets from the JSON file
  const datasetIndex = datasets.findIndex(
    (d) => d.id === parseInt(req.params.id)
  ); // Find the dataset by ID

  if (datasetIndex !== -1) {
    // Update the dataset with the new values from the request body
    const updatedDataset = { ...datasets[datasetIndex], ...req.body };
    datasets[datasetIndex] = updatedDataset; // Update the dataset in the array
    writeFile(datasets); // Write the updated array back to the JSON file
    res.json(updatedDataset); // Send back the updated dataset
  } else {
    res.status(404).send("Dataset not found");
  }
});

// Delete a dataset
app.delete("/api/datasets/:id", (req, res) => {
  const datasets = readFile();
  const updatedDatasets = datasets.filter(
    (d) => d.id !== parseInt(req.params.id)
  );

  if (updatedDatasets.length === datasets.length) {
    res.status(404).send("Dataset not found");
  } else {
    writeFile(updatedDatasets);
    res.send("Dataset deleted");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
