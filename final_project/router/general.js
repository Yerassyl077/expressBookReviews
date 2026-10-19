const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get all books using Promises
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  });
});

// Task 11: Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_book = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  get_book
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on Author using Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const get_authors = new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    }
    resolve(booksByAuthor);
  });
  get_authors.then((bks) => res.send(JSON.stringify(bks, null, 4)));
});

// Task 13: Get book details based on Title using Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const get_titles = new Promise((resolve, reject) => {
    let booksByTitle = [];
    for (let key in books) {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    }
    resolve(booksByTitle);
  });
  get_titles.then((bks) => res.send(JSON.stringify(bks, null, 4)));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
