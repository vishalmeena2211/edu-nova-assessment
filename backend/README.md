# Library Management System - Backend
This repository contains the backend code for the Library Management System assessment completed for EduNova.

## How to Run

1. **Clone the repository:**
    ```bash
    git clone https://github.com/vishalmeena2211/edu-nova-assessment.git
    cd edu-nova-assessment/backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables:
    ```env
    MONGO_URI=your_mongo_uri
    PORT=your_port
    ```

4. **Run the server:**
    ```bash
    npm run dev
    ```

The server will start on `http://localhost:5000`.

## API Routes

### Book Routes
- **Get all books:**
  ```http
  GET /books
  ```
- **Get book by ID:**
  ```http
  GET /books/:id
  ```
- **Create a new book:**
  ```http
  POST /books
  ```

### Books Search Routes
- **Search books by name:**
  ```http
  GET /books/search/name
  ```
- **Search books by rent:**
  ```http
  GET /books/search/rent
  ```
- **Search books by category:**
  ```http
  GET /books/search/category
  ```

### User Routes
- **Create a new user:**
  ```http
  POST /users/create
  ```
- **Get all users:**
  ```http
  GET /users/
  ```
- **Get user by ID:**
  ```http
  GET /users/:id
  ```

### Transaction Query Routes
- **Issue a book:**
  ```http
  POST /transactions/issue
  ```
- **Return a book:**
  ```http
  POST /transactions/return
  ```
- **Get book history:**
  ```http
  POST /transactions/history
  ```
- **Get book rent:**
  ```http
  POST /transactions/rent
  ```
- **Get user books:**
  ```http
  POST /transactions/user-books
  ```
- **Get books issued in a date range:**
  ```http
  POST /transactions/date-range
  ```
- **Get issued books:**
  ```http
  GET /transactions/issued-books
  ```
- **Get unissued books:**
  ```http
  GET /transactions/un-issued-books
  ```

Feel free to explore and contribute to the project!