const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await or Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  getBooks.then((bks) => res.send(JSON.stringify(bks, null, 4)));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  getBook
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getAuthorBooks = new Promise((resolve, reject) => {
    let matchingBooks = [];
    for (let key in books) {
      if (books[key].author === author) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    }
    resolve(matchingBooks);
  });
  getAuthorBooks.then((bks) => res.send(JSON.stringify({booksbyauthor: bks}, null, 4)));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getTitleBooks = new Promise((resolve, reject) => {
    let matchingBooks = [];
    for (let key in books) {
      if (books[key].title === title) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    }
    resolve(matchingBooks);
  });
  getTitleBooks.then((bks) => res.send(JSON.stringify({booksbytitle: bks}, null, 4)));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
