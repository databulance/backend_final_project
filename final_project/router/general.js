const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});



// Get the list of all books using Promises
public_users.get('/', (req, res) => {
  axios.get('http://localhost:5000/') 
    .then(response => {
      const books = response.data; 
      return res.status(200).send(JSON.stringify(books, null, 2)); 
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      return res.status(500).send("Error fetching books.");
    });
});


// Get book details by ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Fetch book details by ISBN
    const bookDetails = response.data; 
    return res.status(200).send(JSON.stringify(bookDetails, null, 2)); 
  } catch (error) {
    console.error('Error fetching book details:', error);
    return res.status(500).send("Error fetching book details.");
  }
});

// Get book details by author using async/await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Fetch book details by author
    const booksByAuthor = response.data; 
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 2)); 
  } catch (error) {
    console.error('Error fetching books by author:', error);
    return res.status(500).send("Error fetching books by author.");
  }
});


// Get book details by title using async/await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Fetch book details by title
    const bookDetails = response.data; 
    return res.status(200).send(JSON.stringify(bookDetails, null, 2)); 
  } catch (error) {
    console.error('Error fetching book by title:', error);
    return res.status(500).send("Error fetching book by title.");
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
