const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js");
let users = require("./auth_users.js");

const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop

async function getBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    return JSON.stringify({message: "success", data: response});
  } catch (error) {
    return JSON.stringify({message: error});
  }
}

async function getBookbyISB(number) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${number}`);
    return JSON.stringify({message: "success", data: response});
  } catch (error) {
    return JSON.stringify({message: error})
  }
}

async function getBookbyAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return JSON.stringify({message: "success", data: response});
  } catch (error) {
    return JSON.stringify({message: error});
  }
}

async function getBookbyTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return JSON.stringify({message: "success", data: response});
  } catch (error) {
    return JSON.stringify({message: error});
  }
}

public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({message: "Could not find ISBN"});
  }
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const author_books = [];
  for (let i = 0; i < 10; i++) {
    if (books[i + 1]["author"] === author) {
      author_books.push(books[i + 1]);
    }
  }
  if (author_books.length == 0) {
    return res.status(404).json({message: "Could not find author"});
  }
  return res.status(200).send(JSON.stringify(author_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title.split("-").join(" ");
  const title_books = [];
  for (let i = 0; i < 10; i++) {
    if (books[i + 1]["title"] === title) {
      title_books.push(books[i + 1]);
    }
  }
  if (title_books.length == 0) {
    return res.status(404).json({message: "Could not find title"});
  }
  return res.status(200).send(JSON.stringify(title_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({message: "Could not find ISBN"});
  }
  return res.status(200).send(JSON.stringify(books[isbn]["reviews"]));
});

module.exports.general = public_users;
