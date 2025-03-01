const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const users = [];

const isValid = (username) => {
  const user = users.find(e => e.username === username);
  return user ? true : false;
};

const authenticatedUser = (username, password) => {
  const userToAuthenticate = users.find(e => e.username === username && e.password === password);
  return userToAuthenticate ? true : false;
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Invalid username or password"});
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
        data: password
    }, "access", { expiresIn: 30 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    console.log(req.sessionID);
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(400).json({message: "Isbn not found"});
  }
  const review = req.body.review;
  if (!review) {
    return res.status(400).json({message: "Invalid review"});
  }
  const username = req.session.authorization.username;
  const currentReview = book.reviews[username];
  book.reviews[username] = review;
  if (currentReview) {
    return res.status(200).send("Review replaced");
  } else {
    return res.status(200).send("Review added");
  }
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(400).json({message: "Isbn not found"});
  }
  const username = req.session.authorization.username;
  delete book.reviews[username];
  return res.status(200).send("Review deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
