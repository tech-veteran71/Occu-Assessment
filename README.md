
# OCCU Senior Developer Exercise

## Description
This is a simple web application to manage datasets with CRUD operations, search functionality, comparison of two datasets, and copy/edit feature. Built with React (frontend), Node.js (backend), and JSON file storage (for persistence).

## Features
- **Status Overview**: Displays 37 status values (`fail`, `warn`, `pass`) with a unique ID.
- **CRUD Operations**: Create, Read, Update, Delete datasets with fields: `name`, `field1`, `field2`, and `field3`.
- **Search**: Search datasets by `name`, `field1`, `field2`, or `field3`.
- **Compare**: Compare two datasets and visually highlight the differences in the fields.
- **Copy/Edit**: Copy an existing dataset, modify it, and save it as a new dataset.

## Installation

2. **Backend Setup**:
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - No database setup required, data is stored in a **JSON file** (`datasets.json`).

   - Start the backend server:
     ```bash
     node index.js
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend:
     ```bash
     npm start
     ```

4. Open your browser and go to `http://localhost:3000`.

## Testing
1. **Create a dataset**: Add a new dataset using the form.
2. **Edit a dataset**: Select a dataset to update and save changes.
3. **Copy a dataset**: Use the "Copy/Edit" button to duplicate and modify a dataset.
4. **Search datasets**: Use the search bar to filter datasets by name or fields.
5. **Compare datasets**: Select two datasets and click "Compare" to see the differences.

## Technologies Used
- React.js (Frontend)
- Node.js & Express (Backend)
- JSON File Storage (Dataset persistence)
