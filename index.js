var express = require('express');
const app = express();
const Knex = require('knex');
const BodyParser = require('body-parser');

//Body-parser config
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());


// database
const database = require('./Database/DbConnection.js');

// routes
const userController = require('./controllers/UsersController.js');
const bookController = require('./controllers/BooksController.js');
const categoriesController = require('./controllers/CategoriesController.js');
const authorsController = require('./controllers/AuthorsController.js');
const publishersController = require('./controllers/PublisherController.js');

app.use('/',userController);
app.use('/',bookController);
app.use('/',categoriesController);
app.use('/',authorsController);
app.use('/',publishersController)



app.listen(4000,() => {
    console.log("the market is on")
})