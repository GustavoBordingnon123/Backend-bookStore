//libraries used
var express = require('express');
const router = express();

//database connection

const databaseBook = require('../Database/DbConnection.js');

//Books CRUD 

router.get('/books', (req, res) => {
    databaseBook.select().table('books').then((books) => {
      res.send(books);
    });
});

router.get('/books/categories/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
  
    databaseBook.select('books.*')
      .from('books')
      .join('books_categories', 'books.id', '=', 'books_categories.bookId')
      .where('books_categories.categoriesId', categoryId)
      .then((rows) => {
        console.log(rows);
        res.json(rows); 
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }); 
      })
      .finally(() => {
        databaseBook.destroy();
      });
}); 

router.get('/books/authors/:authorId', (req, res) => {
    const authorId = req.params.authorId;
  
    databaseBook.select('books.*')
      .from('books')
      .join('books_authors', 'books.id', '=', 'books_authors.bookId')
      .where('books_authors.authorId', authorId)
      .then((rows) => {
        console.log(rows);
        res.json(rows); 
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }); 
      })
      .finally(() => {
        databaseBook.destroy();
      });
});

router.get('/books/publishers/:publishersId', (req, res) => {
    const publishersId = req.params.publishersId;
  
    databaseBook.select('books.*')
      .from('books')
      .join('books_publishers', 'books.id', '=', 'books_publishers.bookId')
      .where('books_publishers.publishersId', publishersId)
      .then((rows) => {
        console.log(rows);
        res.json(rows); 
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }); 
      })
      .finally(() => {
        databaseBook.destroy();
      });
});


router.post('/books', (req, res) => {
    
    NewBook = {
        name: "A filosofia de nit",
        capa: "num-tem",
        price:230.0,
        description: "Um livro que ensina sobre os fundamentos da filosfia desenvolvida por nit",
        qntPages: 350,
        editorId:2,
        autorId:2,
        heigth:30,
        width:50,
        idCategoria: 6
    }


    async function validateName(name){
        
        let errosName = [];
        let statusCode = 200;
    
        const comprimentoMinimo = 5;
        const comprimentoMaximo = 50;
        const caracteresPermitidos = /^[A-Za-z\s]+$/; 
        const espacosConsecutivos = /\s{2,}/; 
    
        //validação se existe livro 
        async function checkBookExists(name) {
            try {
              const result = await databaseBook.select().table('books').where('name', name);
              if(result.length > 0){
                errosName.push('Esse livro ja existe');
                statusCode = 400;
              }
            }catch (error) {
              console.error('Erro ao verificar o email:', error);
              return false;
            }
        }

        const bookExists = await checkBookExists(name);

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
    

    function validateCapa(capaUrl){
        
        let erroCapa = "";
        let = statusCode = 200;

        if(capaUrl.length == 0){
            erroCapa = "Você precisa inserir uma capa"
            statusCode = 400;
        }

        if(statusCode != 400){
            return 200;
        }else {
            return erroCapa;
        }


    }

    function validatePrice(price){
        
        let errosPrice = [];
        let = statusCode = 200;

        const valorMaximo = 100000;
        const regexNumero = /^-?\d+(\.\d+)?$/;
        const regexCasasDecimais = /^\d+(?:\.\d{1,2})?$/;


        if(price.length == 0){
            passwordErrors.push('Você precisa inserir um preço')
            statusCode = 400;
        }

        if(price > valorMaximo){
            passwordErrors.push('O preço colocado passou do limite do site')
            statusCode = 400;
        }

        if(price < 0){
            erroCapa = "Não é permitido preços negativos"
            statusCode = 400;
        }

        if(!regexNumero.test(price)) {
            errosPrice.push("O preço só deve conter números");
            statusCode = 400;
        }

        if(!regexCasasDecimais.test(price)){
            errosPrice.push("Simplique as casas decimais de seu preço, exemplo se tiver 19.091 deixe como 19.09");
            statusCode = 400;
        }



        if(statusCode != 400){
            return 200;
        }else {
            return errosPrice;
        }


    }

    function validateDescription(description){

        
        let erroDescription = "";
        let = statusCode = 200;

        const comprimentoMinimo = 5;
        const comprimentoMaximo = 50;

        if(description < comprimentoMinimo || description > comprimentoMaximo){
            erroDescription = "A descrição está muito pequena ou muito grande"
            statusCode = 400;
        }

        if(statusCode != 400){
            return 200;
        }else {
            return erroDescription;
        }
    }

    function validateQntPages(qntPages){
        
        let pagesErros = [];
        let = statusCode = 200;

        const valorMaximo = 5000;
        const regexNumero = /^-?\d+(\.\d+)?$/;
        const regexCasasDecimais = /^\d+(?:\.\d{1,2})?$/;


        if(qntPages.length == 0){
            pagesErros.push('Você precisa informar a quantidade de páginas')
            statusCode = 400;
        }

        if(qntPages > valorMaximo){
            pagesErros.push('As quantidades de páginas passou do limite estabelecido no site')
            statusCode = 400;
        }

        if(qntPages < 0){
            pagesErros = "Não é permitido um livro ter páginas negativas"
            statusCode = 400;
        }

        if(!regexNumero.test(qntPages)) {
            pagesErros.push("O preço só deve conter números");
            statusCode = 400;
        }


        if(statusCode != 400){
            return 200;
        }else {
            return pagesErros;
        }


    }

    function validateHeightAndWidth(heigth,width){

        let heigthAndWidthErros = [];
        let = statusCode = 200;

        const valorMaximo = 50;
        const regexNumero = /^-?\d+(\.\d+)?$/;

        // if(heigth.length == 0 || width.length == 0){
        //     heigthAndWidthErros.push('Você precisa informar os tamanhos do livro')
        //     statusCode = 400;
        // }

        // if(heigth == 0 || width == 0){
        //     heigthAndWidthErros.push('Você precisa informar os tamanhos do livro')
        //     statusCode = 400;
        // }

        if(heigth > valorMaximo || width > valorMaximo){
            heigthAndWidthErros.push('Um dos tamanhos excedeu o limite')
            statusCode = 400;
        }

        if(heigth < 0 || width < 0){
            heigthAndWidthErros = "Não é permitido um livro ter páginas negativas"
            statusCode = 400;
        }

        if(!regexNumero.test(heigth) || !regexNumero.test(width)) {
            heigthAndWidthErros.push("Os tamanhos precisam ser inseridos apenas como numeros");
            statusCode = 400;
        }

        if(statusCode != 400){
            return 200;
        }else {
            return heigthAndWidthErros;
        }

        
    }

    async function runValidation(data) {
        
        const isNameRight = await validateName(data.name);
        const isCapaRight = validateCapa(data.capa);
        const isPriceRight = validatePrice(data.price);
        const isDescriptionRight = validateDescription(data.description);
        const isQntPagesRight = validateQntPages(data.qntPages);
        const isHeightAndWidhtRight = validateHeightAndWidth(data.heigth,data.width);
    
        if(isNameRight == 200){
          if(isCapaRight == 200){
            if(isPriceRight == 200){
                if(isDescriptionRight == 200){
                    if(isQntPagesRight){
                        if(isHeightAndWidhtRight){
    
                            databaseBook.insert(data).into('books').then(NewBook => {          
                                res.send("you suceffully added: " + NewBook.name); 
                                return                  
                              }).catch(error => {
                                console.log(error);
                              }) 
    
                        }else{
                            res.send(isHeightAndWidhtRight);
                            return
                        }
                    }else{
                        res.send(isQntPagesRight);
                        return
                    }
                }else{
                    res.send(isDescriptionRight);
                    return
                }
            }else{
              res.send(isPriceRight);
              return
            }
          }else{
            res.send(isCapaRight);
            return
          }
        }else{
          res.send(isNameRight);
          return
        }
    }
        
    runValidation(NewBook);
    return

})

router.put('/books', (req, res) => {
    
    Book = {
        name: "Harry potter",
        capa: "num-tem",
        price:30.0,
        description: "muleke descobriu que é bruxo e etc",
        qntPages: 200,
        editorId:2,
        autorId:2,
        heigth:30,
        width:50
    }

    NewBook = {
        name: "Harry potter Novoo",
        capa: "num-tem",
        price:30.0,
        description: "muleke descobriu que é bruxo e etc",
        qntPages: 200,
        editorId:2,
        autorId:2,
        heigth:30,
        width:50
    }


    async function validateName(name){
        
        let errosName = [];
        let statusCode = 200;
    
        const comprimentoMinimo = 5;
        const comprimentoMaximo = 50;
        const caracteresPermitidos = /^[A-Za-z\s]+$/; 
        const espacosConsecutivos = /\s{2,}/; 
    
        //validação se existe livro 
        async function checkBookExists(name) {
            try {
              console.log(name)
              const result = await databaseBook.select().table('books').where('name', name);
              if(result.length > 0){
                errosName.push('Esse livro ja existe');
                statusCode = 400;
              }
            }catch (error) {
              console.error('Erro ao verificar o email:', error);
              return false;
            }
        }

        const bookExists = await checkBookExists(name);

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
    
    function validateCapa(capaUrl){
        
        let erroCapa = "";
        let = statusCode = 200;

        if(capaUrl.length == 0){
            erroCapa = "Você precisa inserir uma capa"
            statusCode = 400;
        }

        if(statusCode != 400){
            return 200;
        }else {
            return erroCapa;
        }


    }

    function validatePrice(price){
        
        let errosPrice = [];
        let = statusCode = 200;

        const valorMaximo = 100000;
        const regexNumero = /^-?\d+(\.\d+)?$/;
        const regexCasasDecimais = /^\d+(?:\.\d{1,2})?$/;


        if(price.length == 0){
            passwordErrors.push('Você precisa inserir um preço')
            statusCode = 400;
        }

        if(price > valorMaximo){
            passwordErrors.push('O preço colocado passou do limite do site')
            statusCode = 400;
        }

        if(price < 0){
            erroCapa = "Não é permitido preços negativos"
            statusCode = 400;
        }

        if(!regexNumero.test(price)) {
            errosPrice.push("O preço só deve conter números");
            statusCode = 400;
        }

        if(!regexCasasDecimais.test(price)){
            errosPrice.push("Simplique as casas decimais de seu preço, exemplo se tiver 19.091 deixe como 19.09");
            statusCode = 400;
        }



        if(statusCode != 400){
            return 200;
        }else {
            return errosPrice;
        }


    }

    function validateDescription(description){

        
        let erroDescription = "";
        let = statusCode = 200;

        const comprimentoMinimo = 5;
        const comprimentoMaximo = 50;

        if(description < comprimentoMinimo || description > comprimentoMaximo){
            erroDescription = "A descrição está muito pequena ou muito grande"
            statusCode = 400;
        }

        if(statusCode != 400){
            return 200;
        }else {
            return erroDescription;
        }
    }

    function validateQntPages(qntPages){
        
        let pagesErros = [];
        let = statusCode = 200;

        const valorMaximo = 5000;
        const regexNumero = /^-?\d+(\.\d+)?$/;
        const regexCasasDecimais = /^\d+(?:\.\d{1,2})?$/;


        if(qntPages.length == 0){
            pagesErros.push('Você precisa informar a quantidade de páginas')
            statusCode = 400;
        }

        if(qntPages > valorMaximo){
            pagesErros.push('As quantidades de páginas passou do limite estabelecido no site')
            statusCode = 400;
        }

        if(qntPages < 0){
            pagesErros = "Não é permitido um livro ter páginas negativas"
            statusCode = 400;
        }

        if(!regexNumero.test(qntPages)) {
            pagesErros.push("O preço só deve conter números");
            statusCode = 400;
        }


        if(statusCode != 400){
            return 200;
        }else {
            return pagesErros;
        }


    }

    function validateHeightAndWidth(heigth,width){

        let heigthAndWidthErros = [];
        let = statusCode = 200;

        const valorMaximo = 50;
        const regexNumero = /^-?\d+(\.\d+)?$/;

        // if(heigth.length == 0 || width.length == 0){
        //     heigthAndWidthErros.push('Você precisa informar os tamanhos do livro')
        //     statusCode = 400;
        // }

        // if(heigth == 0 || width == 0){
        //     heigthAndWidthErros.push('Você precisa informar os tamanhos do livro')
        //     statusCode = 400;
        // }

        if(heigth > valorMaximo || width > valorMaximo){
            heigthAndWidthErros.push('Um dos tamanhos excedeu o limite')
            statusCode = 400;
        }

        if(heigth < 0 || width < 0){
            heigthAndWidthErros = "Não é permitido um livro ter páginas negativas"
            statusCode = 400;
        }

        if(!regexNumero.test(heigth) || !regexNumero.test(width)) {
            heigthAndWidthErros.push("Os tamanhos precisam ser inseridos apenas como numeros");
            statusCode = 400;
        }

        if(statusCode != 400){
            return 200;
        }else {
            return heigthAndWidthErros;
        }

        
    }

    async function runValidation(data) {
        
        const isNameRight = await validateName(data.name);
        const isCapaRight = validateCapa(data.capa);
        const isPriceRight = validatePrice(data.price);
        const isDescriptionRight = validateDescription(data.isDescriptionRight);
        const isQntPagesRight = validateQntPages(data.qntPages);
        const isHeightAndWidhtRight = validateHeightAndWidth(data.heigth,data.width);
    
        if(isNameRight == 200){
          if(isCapaRight == 200){
            if(isPriceRight == 200){
                if(isDescriptionRight == 200){
                    if(isQntPagesRight){
                        if(isHeightAndWidhtRight){
    
                            databaseBook.update(NewBook).into('books').where({name: Book.name})
                            .then(NewBook => {          
                                res.send("you suceffully added: " + NewBook.name); 
                                return           
                            }).catch(error => {
                                console.log(error);
                            }) 
    
                        }else{
                            res.send(isHeightAndWidhtRight);
                            return
                        }
                    }else{
                        res.send(isQntPagesRight);
                        return
                    }
                }else{
                    res.send(isDescriptionRight);
                    return
                }
            }else{
              res.send(isPriceRight);
              return
            }
          }else{
            res.send(isCapaRight);
            return
          }
        }else{
          res.send(isNameRight);
          return
        }
    }
        
    runValidation(NewBook);
    return

})

router.delete('/books',(req,res) => {
    let name = "Harry potter Novoo";
  
    databaseBook.select().table('books').where({name: name}).then(books => {
        
        if(books.length > 0 ){
            databaseBook.delete().where({name: name}).table('books').then(data => {
        
                res.statusCode = 200;
                console.log('suceffuly delete the user: ', name);
                res.send('suceffuly delete the user: ' + name);
                          
            }).catch(error => {
                console.log(error);
            })
  
        }else{
            console.log('this user dont exist')
            res.sendStatus(400);
        }
    });
});

module.exports = router;