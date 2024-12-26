const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if a username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to authenticate a user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// User login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

  // Store token in session
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session?.user?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized: Please log in to add a review" });
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
