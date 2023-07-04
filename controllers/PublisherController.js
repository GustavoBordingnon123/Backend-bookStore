//libraries used
var express = require('express');
const router = express();

//database connection

const databasePublishers = require('../Database/DbConnection.js');

//Publisher CRUD (update bugado)

router.get('/publishers', (req, res) => {
    databasePublishers.select().table('publishers').then((publishers) => {
      res.send(publishers);
    });
});

router.post('/publishers', (req,res) => {

  let newPublisherName = req.body.newPublisherName;

  newCategory = {
      name: newPublisherName
  }


  async function validateName(name){
      
      let errosName = [];
      let statusCode = 200;
  
      const comprimentoMinimo = 5;
      const comprimentoMaximo = 50;
      const caracteresPermitidos = /^[A-Za-z\s]+$/; 
      const espacosConsecutivos = /\s{2,}/; 
  

      async function checkCategoryExists(name) {
          try {
            const result = await databasePublishers.select().table('publishers').where('name', name);
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

          databasePublishers.insert(data).into('publishers').then(data => {          
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
      
  runValidation(newCategory);
  return
});

router.put('/publishers', (req,res) => {

  

  newPublisher = {
    name: "Panini",
  }

  publisher = {
    name: 'Dc-comics'
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

        databasePublishers
        .update(newPublisher)
        .into('publishers')
        .where({ name: publisher.name })
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
      
  runValidation(newPublisher);
  return
});


router.delete('/publishers', (req,res) => {

  let publisherName = req.body.publisherName;
  let name = publisherName;

  databasePublishers.select().table('publishers').where({name: name}).then(publishers => {
      
      if(publishers.length > 0 ){
          databasePublishers.delete().where({name: name}).table('publishers').then(data => {
      
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