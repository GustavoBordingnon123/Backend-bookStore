//libraries used
var express = require('express');
const router = express();

//database connection

const databaseCategories = require('../Database/DbConnection.js');


//Categories CRUD

router.get('/categories', (req, res) => {
    databaseCategories.select().table('categories').then((categories) => {
      res.send(categories);
    });
});


router.post('/categories', (req,res) => {

    let categoryName = req.body.categoryName;

    const newCategory = {
        name: categoryName
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
              const result = await databaseCategories.select().table('categories').where('name', name);
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
            databaseCategories.insert(data).into('categories').then(data => {          
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

router.put('/categories', (req,res) => {


    
  let categoryName = req.body.categoryName;
  let newCategoryName = req.body.newCategoryName;

  category = {
    name: categoryName,
  }
  
  newCategory = {
    name: newCategoryName,
  }

  console.log(category)
  console.log(newCategory)
    


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

            databaseCategories
            .update(newCategory)
            .into('categories')
            .where({ name: category.name })
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
        
    runValidation(newCategory);
    return
});


router.delete('/categories', (req,res) => {

    let categoryName = req.body.categoryName;

    let name = categoryName;
  
    databaseCategories.select().table('categories').where({name: name}).then(categories => {

      if(categories.length > 0 ){
            databaseCategories.delete().where({name: name}).table('categories').then(data => {
        
                res.statusCode = 200;
                console.log('suceffuly delete the category: ', name);
                res.send('suceffuly delete the category: ' + name);
                          
            }).catch(error => {
                console.log(error);
            })
  
        }else{
            console.log('this c dont exist')
            res.sendStatus(400);
        }
    });
});


module.exports = router;