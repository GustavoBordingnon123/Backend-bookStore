var express = require('express');
const app = express();
const Knex = require('knex');

// database
const database = require('./Database/DbConnection.js');

// routes
const userController = require('./controllers/UsersController.js');
const bookController = require('./controllers/BooksController.js');
const categoriesController = require('./controllers/CategoriesController.js');


app.use('/',userController);
app.use('/',bookController);
app.use('/',categoriesController);



app.listen(4000,() => {
    console.log("the market is on")
})