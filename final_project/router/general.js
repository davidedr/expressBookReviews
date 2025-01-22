const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;
  if(!username || !password)
    return res.status(403).send(`Missing username or password!`);
  if (isValid(username))
    return res.status(403).send(`User: ${username} already registerd!`);
  users.push({ username, password });
  return res.send(`User: ${username} successfully registered, can login now.`);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if (!isbn)
    return res.status(404).send(`ISBN not valid!`);
  const found_book = books[isbn];
  if (found_book)
    return res.send(JSON.stringify(found_book, null, 4));
  else
    return res.status(404).send(`Book w/ ISBN: ${isbn} not found!`);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;  
  if (!author)
    return res.status(404).send(`author not valid!`);
  let found_books = [];
  for (k in books) {
    let b  = books[k];
    if (b.author === author)
      found_books.push(b);
  }
  if (found_books && found_books.length > 0)
    return res.send(JSON.stringify(found_books, null, 4));
  else
    return res.status(404).send(`No books found w/ author: ${author}!`);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;  
  if (!title)
    return res.status(404).send(`title not valid!`);
  let found_books = [];
  for (k in books) {
    let b  = books[k];
    if (b.title === title)
      found_books.push(b);
  }
  if (found_books && found_books.length > 0)
    return res.send(JSON.stringify(found_books, null, 4));
  else
    return res.status(404).send(`No books found w/ title: ${title}!`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if (!isbn)
    return res.status(404).send(`ISBN not valid!`);
  const found_book = books[isbn];
  if (found_book)
    return res.send(JSON.stringify(found_book.reviews, null, 4));
  else
    return res.status(404).send(`Book w/ ISBN: ${isbn} not found!`);
});

module.exports.general = public_users;
