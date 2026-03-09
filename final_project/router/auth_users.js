const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  const filtered_users = users.filter((user) => user.username === username);
  return filtered_users.length > 0;
}

const authenticatedUser = (username,password)=>{ 
  const filtered_users = users.filter(
    (user) => user.username === username && user.password === password);
  return filtered_users.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, "access", {expiresIn: 60*60});
    req.session.authorization = {accessToken};
    return res.status(200).send({message: "User successfully logged in"});

  } else {
    return res.status(208).send({message: "Invalid loggin. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review.split("-").join(" ");
  books[isbn]["review"][req.user] = review;

  return res.status(300).json({message: "Successfully Added"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
