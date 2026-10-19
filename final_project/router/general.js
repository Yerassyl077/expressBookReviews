const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

// Helper endpoint for internal books retrieval
public_users.get('/internal/books', function (req, res) {
  return res.status(200).json(books);
});

// Task 10: Get all books using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(200).json(books);
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get('http://localhost:5000/internal/books')
    .then(response => {
      const book = response.data[isbn];
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      }
      return res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get book details based on Author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    const allBooks = response.data;
    let matchingBooks = [];
    for (let id in allBooks) {
      if (allBooks[id].author === author) {
        matchingBooks.push(allBooks[id]);
      }
    }
    return res.status(200).json(matchingBooks);
  } catch (error) {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].author === author) {
        matchingBooks.push(books[id]);
      }
    }
    return res.status(200).json(matchingBooks);
  }
});

// Task 13: Get book details based on Title using Async/Await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    const allBooks = response.data;
    let matchingBooks = [];
    for (let id in allBooks) {
      if (allBooks[id].title === title) {
        matchingBooks.push(allBooks[id]);
      }
    }
    return res.status(200).json(matchingBooks);
  } catch (error) {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].title === title) {
        matchingBooks.push(books[id]);
      }
    }
    return res.status(200).json(matchingBooks);
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
