//libraries used
var express = require('express');
const router = express();

//database connection

const databaseAuthors = require('../Database/DbConnection.js');

//Authors CRUD (update bugado)

router.get('/authors', (req, res) => {
    databaseAuthors.select().table('authors').then((authors) => {
      res.send(authors);
    });
});

router.post('/authors', (req,res) => {

  
  let authorName = req.body.authorName;

    
  let newAuthor = {
      name: authorName
  }


  async function validateName(name){
      
      let errosName = [];
      let statusCode = 200;
  
      const comprimentoMinimo = 5;
      const comprimentoMaximo = 50;
      const caracteresPermitidos = /^[A-Za-z\s]+$/; 
      const espacosConsecutivos = /\s{2,}/; 
  
      //validação se existe categoria 
      async function checkCategoryExists(name) {
          try {
            const result = await databaseAuthors.select().table('authors').where('name', name);
            if(result.length > 0){
              errosName.push('Essa categoria ja existe');
              statusCode = 400;
            }
          }catch (error) {
            console.error('Erro ao verificar o categoria:', error);
            return false;
          }
      }

      const bookExists = await checkCategoryExists(name);

      if (bookExists) {
          statusCode = 400;
      }

      // outras validações
      
      if (name.length < comprimentoMinimo || name.length > comprimentoMaximo) {
          errosName.push("O tamanho do name esta muito grande ou pequeno");
          statusCode = 400;
      }
      
      if (!caracteresPermitidos.test(name)) {
          errosName.push("O name está ultizando caracteres que não são permitidos");
          statusCode = 400;
      }
      
      if (name.trim() !== name || espacosConsecutivos.test(name)) {
          errosName.push("O name está ultizando muitos espaços em branco");
          statusCode = 400;
      }

      if(statusCode != 400){
        return 200;
      }else {
        return errosName;
      }
  }  


  async function runValidation(data) {
      
      const isNameRight = await validateName(data.name);
  
      if(isNameRight == 200){

          databaseAuthors.insert(data).into('authors').then(data => {          
              res.send("you suceffully added: " + data.name); 
              return                  
            }).catch(error => {
              console.log(error);
            }) 

      }else{
        res.send(isNameRight);
        return
      }
  }
      
  runValidation(newAuthor);
  return
});

router.put('/authors', (req,res) => {

  let authorName = req.body.authorName;
  let newAuthorName = req.body.newAuthorName;

  author = {
    name: authorName,
  }
  
  newAuthor = {
    name: newAuthorName,
  }

  


  async function validateName(name){
      
      let errosName = [];
      let statusCode = 200;
  
      const comprimentoMinimo = 5;
      const comprimentoMaximo = 50;
      const caracteresPermitidos = /^[A-Za-z\s]+$/; 
      const espacosConsecutivos = /\s{2,}/; 

      // outras validações
      
      if (name.length < comprimentoMinimo || name.length > comprimentoMaximo) {
          errosName.push("O tamanho do name esta muito grande ou pequeno");
          statusCode = 400;
      }
      
      if (!caracteresPermitidos.test(name)) {
          errosName.push("O name está ultizando caracteres que não são permitidos");
          statusCode = 400;
      }
      
      if (name.trim() !== name || espacosConsecutivos.test(name)) {
          errosName.push("O name está ultizando muitos espaços em branco");
          statusCode = 400;
      }

      if(statusCode != 400){
        return 200;
      }else {
        return errosName;
      }
  }  


  async function runValidation(data) {
      
      const isNameRight = await validateName(data.name);
  
      if(isNameRight == 200){

        databaseAuthors
        .update(newAuthor)
        .into('authors')
        .where({ name: author.name })
        .then((NewBook) => {
          res.send("Você adicionou com sucesso: " + NewBook.name);
          return;
        })
        .catch((error) => {
          console.log(error);
        });
      }else{
        res.send(isNameRight);
        return
      }
  }
      
  runValidation(newAuthor);
  return
});


router.delete('/authors', (req,res) => {

  let authorName = req.body.authorName;

  let name = authorName;

  databaseAuthors.select().table('authors').where({name: name}).then(authors => {
      
      if(authors.length > 0 ){
          databaseAuthors.delete().where({name: name}).table('authors').then(data => {
      
              res.statusCode = 200;
              console.log('suceffuly delete the author: ', name);
              res.send('suceffuly delete the author: ' + name);
                        
          }).catch(error => {
              console.log(error);
          })

      }else{
          console.log('this author dont exist')
          res.sendStatus(400);
      }
  });
});


module.exports = router;