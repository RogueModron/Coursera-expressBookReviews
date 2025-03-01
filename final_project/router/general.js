const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Invalid username or password"});
  }
  if (isValid(username)) {
    return res.status(400).json({message: "User already registered"});
  }
  users.push({ username, password });
  return res.status(200).json({message: "User registered"});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  new Promise((resolve, reject) => {
    resolve(res.send(books));
  });

  /*
  return res.send(books);
  */
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    let resolved;
    if (!book) {
      resolved = res.send({});
    }
    resolved = res.send(book);
    resolve(resolved);
  });

  /*
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.send({});
  }
  return res.send(book);
  */
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const results = []
    Object.values(books).forEach((book) => {
      if (book.author.toLowerCase() === author.toLowerCase()) {
        results.push(book)
      }
    });
    resolve(res.send(results));
  });

  /*
  const author = req.params.author;
  const results = []
  Object.values(books).forEach((book) => {
    if (book.author.toLowerCase() === author.toLowerCase()) {
      results.push(book)
    }
  });
  return res.send(results);
  */
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const results = []
    Object.values(books).forEach((book) => {
      if (book.title.toLowerCase() === title.toLowerCase()) {
        results.push(book)
      }
    });
    resolve(res.send(results));
  });

  /*
  const title = req.params.title;
  const results = []
  Object.values(books).forEach((book) => {
    if (book.title.toLowerCase() === title.toLowerCase()) {
      results.push(book)
    }
  });
  return res.send(results);
  */
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.send({});
  }
  return res.send(book.reviews);
});

module.exports.general = public_users;
