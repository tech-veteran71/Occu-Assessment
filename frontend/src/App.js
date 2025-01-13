import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [statuses, setStatuses] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [newDataset, setNewDataset] = useState({
    name: "",
    field1: "",
    field2: "",
    field3: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [editingDataset, setEditingDataset] = useState(null);
  const [copyingDataset, setCopyingDataset] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/statuses")
      .then((response) => setStatuses(response.data));
    axios
      .get("http://localhost:5000/api/datasets")
      .then((response) => setDatasets(response.data));
  }, []);

  const handleSearch = () => {
    axios
      .get(`http://localhost:5000/api/datasets?search=${searchTerm}`)
      .then((response) => setDatasets(response.data));
  };

  const handleCreate = () => {
    axios
      .post("http://localhost:5000/api/datasets", newDataset)
      .then(() =>
        axios
          .get("http://localhost:5000/api/datasets")
          .then((response) => setDatasets(response.data))
      );
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/datasets/${id}`)
      .then(() =>
        axios
          .get("http://localhost:5000/api/datasets")
          .then((response) => setDatasets(response.data))
      );
  };

  const handleSelectForComparison = (dataset) => {
    if (selectedDatasets.length < 2) {
      setSelectedDatasets([...selectedDatasets, dataset]);
    }
  };

  const handleCompareDatasets = () => {
    if (selectedDatasets.length === 2) {
      const [dataset1, dataset2] = selectedDatasets;
      const comparison = {
        name: dataset1.name !== dataset2.name,
        field1: dataset1.field1 !== dataset2.field1,
        field2: dataset1.field2 !== dataset2.field2,
        field3: dataset1.field3 !== dataset2.field3,
      };
      setComparisonResult(comparison);
    }
  };

  const handleSelectForEdit = (dataset) => {
    setEditingDataset(dataset); // Set the dataset to be edited
  };

  const handleSaveEdit = () => {
    axios
      .put(
        `http://localhost:5000/api/datasets/${editingDataset.id}`,
        editingDataset
      ) // Send PUT request with updated dataset
      .then(() => {
        axios
          .get("http://localhost:5000/api/datasets")
          .then((response) => setDatasets(response.data)); // Reload datasets
        setEditingDataset(null); // Clear the edit form
      })
      .catch((error) => {
        console.error("Error saving edit:", error);
        alert("Error saving the dataset");
      });
  };

  const handleSelectForCopy = (dataset) => {
    setCopyingDataset({ ...dataset, id: null }); // Set the dataset to be copied
  };

  const handleSaveCopy = () => {
    axios
      .post("http://localhost:5000/api/datasets", copyingDataset) // Save the copied dataset as new
      .then(() => {
        axios
          .get("http://localhost:5000/api/datasets")
          .then((response) => setDatasets(response.data));
        setCopyingDataset(null); // Clear the copy form
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Status Overview</h1>
      <div className="row">
        {statuses.map((status) => (
          <div className="col-md-4 mb-3" key={status.id}>
            <div
              className={`card ${
                status.status === "pass"
                  ? "bg-success"
                  : status.status === "warn"
                  ? "bg-warning"
                  : "bg-danger"
              } text-white`}
            >
              <div className="card-body">
                <h5 className="card-title">ID: {status.id}</h5>
                <p className="card-text">Status: {status.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-center my-4">Datasets</h1>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, field1, field2, field3..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Table to display datasets */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Field1</th>
            <th>Field2</th>
            <th>Field3</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset) => (
            <tr key={dataset.id}>
              <td>{dataset.name}</td>
              <td>{dataset.field1}</td>
              <td>{dataset.field2}</td>
              <td>{dataset.field3}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(dataset.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-info btn-sm ml-2"
                  style={{ marginLeft: "8px" }}
                  onClick={() => handleSelectForComparison(dataset)}
                >
                  {selectedDatasets.includes(dataset)
                    ? "Selected"
                    : "Select for Comparison"}
                </button>
                <button
                  className="btn btn-warning btn-sm ml-2"
                  style={{ marginLeft: "8px" }}
                  onClick={() => handleSelectForEdit(dataset)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-primary btn-sm ml-2"
                  style={{ marginLeft: "8px" }}
                  onClick={() => handleSelectForCopy(dataset)}
                >
                  Copy/Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form for selected dataset */}
      {editingDataset && (
        <div className="card p-4">
          <h3>Edit Dataset</h3>
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={editingDataset.name}
              onChange={(e) =>
                setEditingDataset({ ...editingDataset, name: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Field1</label>
            <input
              type="text"
              className="form-control"
              value={editingDataset.field1}
              onChange={(e) =>
                setEditingDataset({ ...editingDataset, field1: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Field2</label>
            <input
              type="text"
              className="form-control"
              value={editingDataset.field2}
              onChange={(e) =>
                setEditingDataset({ ...editingDataset, field2: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Field3</label>
            <input
              type="text"
              className="form-control"
              value={editingDataset.field3}
              onChange={(e) =>
                setEditingDataset({ ...editingDataset, field3: e.target.value })
              }
            />
          </div>
          <button className="btn btn-success" onClick={handleSaveEdit}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary ml-2"
            style={{ marginLeft: "8px" }}
            onClick={() => setEditingDataset(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Copy Form for selected dataset */}
      {copyingDataset && (
        <div className="card p-4">
          <h3>Copy/Edit Dataset</h3>
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={copyingDataset.name}
              onChange={(e) =>
                setCopyingDataset({ ...copyingDataset, name: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Field1</label>
            <input
              type="text"
              className="form-control"
              value={copyingDataset.field1}
              onChange={(e) =>
                setCopyingDataset({ ...copyingDataset, field1: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Field2</label>
            <input
              type="text"
              className="form-control"
              value={copyingDataset.field2}
              onChange={(e) =>
                setCopyingDataset({ ...copyingDataset, field2: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Field3</label>
            <input
              type="text"
              className="form-control"
              value={copyingDataset.field3}
              onChange={(e) =>
                setCopyingDataset({ ...copyingDataset, field3: e.target.value })
              }
            />
          </div>
          <button className="btn btn-success" onClick={handleSaveCopy}>
            Save Copy
          </button>
          <button
            className="btn btn-secondary ml-2"
            onClick={() => setCopyingDataset(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Comparison Section */}
      {selectedDatasets.length === 2 && (
        <div className="my-4">
          <h3>Compare Datasets</h3>
          <div className="row">
            <div className="col-md-6">
              <h5>Dataset 1</h5>
              <ul>
                <li>
                  <strong>Name:</strong> {selectedDatasets[0].name}
                </li>
                <li>
                  <strong>Field1:</strong> {selectedDatasets[0].field1}
                </li>
                <li>
                  <strong>Field2:</strong> {selectedDatasets[0].field2}
                </li>
                <li>
                  <strong>Field3:</strong> {selectedDatasets[0].field3}
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5>Dataset 2</h5>
              <ul>
                <li>
                  <strong>Name:</strong> {selectedDatasets[1].name}
                </li>
                <li>
                  <strong>Field1:</strong> {selectedDatasets[1].field1}
                </li>
                <li>
                  <strong>Field2:</strong> {selectedDatasets[1].field2}
                </li>
                <li>
                  <strong>Field3:</strong> {selectedDatasets[1].field3}
                </li>
              </ul>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleCompareDatasets}>
            Compare
          </button>
        </div>
      )}

      {/* Comparison Result */}
      {comparisonResult && (
        <div className="my-4">
          <h5>Comparison Result</h5>
          <ul>
            <li>
              <strong>Name:</strong>{" "}
              {comparisonResult.name ? "Different" : "Same"}
            </li>
            <li>
              <strong>Field1:</strong>{" "}
              {comparisonResult.field1 ? "Different" : "Same"}
            </li>
            <li>
              <strong>Field2:</strong>{" "}
              {comparisonResult.field2 ? "Different" : "Same"}
            </li>
            <li>
              <strong>Field3:</strong>{" "}
              {comparisonResult.field3 ? "Different" : "Same"}
            </li>
          </ul>
        </div>
      )}

      <h1 className="text-center my-4">Add Dataset</h1>
      <div className="card p-4">
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={newDataset.name}
            onChange={(e) =>
              setNewDataset({ ...newDataset, name: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-3">
          <label>Field1</label>
          <input
            type="text"
            className="form-control"
            value={newDataset.field1}
            onChange={(e) =>
              setNewDataset({ ...newDataset, field1: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-3">
          <label>Field2</label>
          <input
            type="text"
            className="form-control"
            value={newDataset.field2}
            onChange={(e) =>
              setNewDataset({ ...newDataset, field2: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-3">
          <label>Field3</label>
          <input
            type="text"
            className="form-control"
            value={newDataset.field3}
            onChange={(e) =>
              setNewDataset({ ...newDataset, field3: e.target.value })
            }
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
}

export default App;
