const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  const user = users.filter(u => u.username === username);
  return user && user.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const auth_user = users.filter(u => u.username === username && u.password === password);
  return auth_user && auth_user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const { username, password } = req.body;
  if(!username || !password)
    return res.status(403).send(`Missing username or password!`);

  if (!authenticatedUser(username, password))
    return res.status(404).send(`User not authenticated!`);

  let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60*60 });
  req.session.authorization = { accessToken, username };
  res.send(`User: ${username} successfully logged in.`);
});

// Add a book review
// PUT http://localhost:5000/customer/auth/review/1?review=aaaaaaa&username=user2 
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const { isbn } = req.params;
  if (!isbn)
    return res.status(404).send(`ISBN not valid!`);
  const { review } = req.query;
  if (!review)
    return res.status(404).send(`review not valid!`);
  //const { username } = req.query;
  const { username } = req.session.authorization;
  if (!username)
    return res.status(404).send(`username not valid!`);
  const book = books[isbn];
  if (!book)
    return res.status(404).send(`ISBN ${isbn} not valid!`);
  if (book.reviews) {
    let found_review = false;
    for(uname in book.reviews)
      if (uname === username) {
        found_review = true;
        break;
      }
    if (found_review) {
      book.reviews[username] = review;
      return res.send(`Review for ISBN: ${isbn} by username: ${username} successfully updated.`);
    }
    else {
      book.reviews[username] = review;
      return res.send(`Review for ISBN: ${isbn} by username: ${username} successfully created.`);
    }
  }
  else {
    book.reviews = { username, review };
    return res.send(`Review for ISBN: ${isbn} by username: ${username} successfully created.`);  
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const { isbn } = req.params;
  if (!isbn)
    return res.status(404).send(`ISBN not valid!`);
  const { username } = req.session.authorization;
  if (!username)
    return res.status(404).send(`username not valid!`);
  const book = books[isbn];
  if (!book)
    return res.status(404).send(`ISBN ${isbn} not valid!`);
  if (book.reviews) {
    let found_review = false;
    for(uname in book.reviews)
      if (uname === username) {
        found_review = true;
        break;
      }
    if (found_review) {
      delete book.reviews[username];
      return res.send(`Review for ISBN: ${isbn} by username: ${username} successfully deleted.`);
    }
    else
     return res.status(404).send(`Review not found for ISBN: ${isbn} by username: ${username}!`);
  }
  else
    return res.status(404).send(`No review found!`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
