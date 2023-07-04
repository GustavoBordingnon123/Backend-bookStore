//libraries used
var express = require('express');
const router = express();
const bcrypt = require('bcryptjs');


//database connection

const databaseUser = require('../Database/DbConnection.js');

//Users crud

router.get('/users', (req, res) => {
  databaseUser.select().table('users').then((users) => {
    res.send(users);
  });
});

router.post('/users',(req,res) => {
  let{nameUser,emailUser,passwordUser} = req.body;

  let NewUserValidation = {
    name: nameUser,
    email: emailUser,
    password: passwordUser
  }


  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(NewUserValidation.password, salt);


  
  NewUserValidation = {
    name: nameUser,
    email: emailUser,
    password: hash
  }

  let NewUser = {
    name: 'Brunin Gomes',
    email: 'brunin@gmail.com',
    password: hash
  }
  

  function validateName(nome){
        
    let errosName = [];
    let statusCode = 200;

    const comprimentoMinimo = 2;
    const comprimentoMaximo = 20;
    const caracteresPermitidos = /^[A-Za-z\s]+$/; 
    const espacosConsecutivos = /\s{2,}/; 
    const nomeComposto = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

    
    if (nome.length < comprimentoMinimo || nome.length > comprimentoMaximo) {
        errosName.push("O tamanho do nome esta muito grande ou pequeno");
        statusCode = 400;
    }
    
    if (!caracteresPermitidos.test(nome)) {
        errosName.push("O nome está ultizando caracteres que não são permitidos");
        statusCode = 400;
    }
    
    if (nome.trim() !== nome || espacosConsecutivos.test(nome)) {
        errosName.push("O nome está ultizando muitos espaços em branco");
        statusCode = 400;
    }
        
    if (!nomeComposto.test(nome)) {
        errosName.push("Coloque seu primeiro nome e sobrenome");
        statusCode = 400;
    }

    if(statusCode != 400){
      return 200;
    }else {
      return errosName;
    }
  }  
      
  async function validateEmail(email) {

    let emailErros = [];
    let statusCode = 200;

    const comprimentoMinimo = 8;
    const comprimentoMaximo = 50;
    const formatoDoEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    async function checkEmailExists(email) {
      try {
        const result = await databaseUser.select().table('users').where('email', email);
        if(result.length > 0){
          emailErros.push('O email ja existe');
          statusCode = 400;
        };

      } catch (error) {
        console.error('Erro ao verificar o email:', error);
        return false;
      }
    }

    if (email.length < comprimentoMinimo || email.length > comprimentoMaximo) {
      emailErros.push("O tamanho do email está muito grande ou pequeno");
      statusCode = 400;
    }

    if (!formatoDoEmail.test(email)) {
      emailErros.push("O email está no formato errado, formato certo: exemplo@exemplo.com");
      statusCode = 400;
    }

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      statusCode = 400;
    }

    if(statusCode != 400){
      return 200;
    }else {
      return emailErros;
    }

  }

  function validatePassword(password) {

    let passwordErrors = [];
    let statusCode = 200;
  
    const comprimentoMinimo = 8;
    
    const regexMaiuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /\d/;
    const regexEspecial = /[!@#$%^&*]/;
    
    if (password.length < comprimentoMinimo) {
      passwordErrors.push("O tamanho da senha está muito pequena");
      statusCode = 400;
    }
    
    if (!regexMaiuscula.test(password) || !regexMinuscula.test(password)) {
      passwordErrors.push("A senha precisa conter letras minusculas e maisculas");
      statusCode = 400;
    }
    
    if (!regexNumero.test(password)) {
      passwordErrors.push("A senha precisa conter numeros");
      statusCode = 400;
    }
    
    if (!regexEspecial.test(password)) {
      passwordErrors.push("A senha precisa conter caracteres especias como #$@&...");
      statusCode = 400;
    }
  
    // if(password != confirmPassword){
    //   passwordErrors.push("A senha precisa ser igual ao confirmar senha");
    //   statusCode = 400;
    // }

    if(statusCode != 400){
      return 200;
    }else {
      return passwordErrors;
    }
  }
    
  async function runValidation(data) {

    const isNameRight = validateName(data.name);
    const isEmailRight = await validateEmail(data.email);
    const isPasswordRight = validatePassword(data.password, data.confirmPassword);


    if(isNameRight == 200){
      if(isEmailRight == 200){
        if(isPasswordRight == 200){
          databaseUser.insert(NewUserValidation).into('users').then(NewUser => {          
            res.send("you suceffully added: " + NewUser.email); 
            return                  
          }).catch(error => {
            console.log(error);
          })  
        }else{
          res.send(isPasswordRight);
          return
        }
      }else{
        res.send(isEmailRight);
        return
      }
    }else{
      res.send(isNameRight);
      return
    }
  }
    
  runValidation(NewUserValidation);
  return

});

router.put('/users',(req,res) => {
  // let{name,email,password} = req.body;

  let NewUserValidation = {
    name: 'Brunin Gomes',
    email: 'brunin@gmail.com',
    password: "#Gb12345678"
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(NewUserValidation.password, salt);


  let NewUser = {
      name: 'Bruninho Gomes',
      email: 'brunin@gmail.com',
      password: hash
  }
  

  function validateName(nome){
        
    let errosName = [];
    let statusCode = 200;

    const comprimentoMinimo = 2;
    const comprimentoMaximo = 20;
    const caracteresPermitidos = /^[A-Za-z\s]+$/; 
    const espacosConsecutivos = /\s{2,}/; 
    const nomeComposto = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

    
    if (nome.length < comprimentoMinimo || nome.length > comprimentoMaximo) {
        errosName.push("O tamanho do nome esta muito grande ou pequeno");
        statusCode = 400;
    }
    
    if (!caracteresPermitidos.test(nome)) {
        errosName.push("O nome está ultizando caracteres que não são permitidos");
        statusCode = 400;
    }
    
    if (nome.trim() !== nome || espacosConsecutivos.test(nome)) {
        errosName.push("O nome está ultizando muitos espaços em branco");
        statusCode = 400;
    }
        
    if (!nomeComposto.test(nome)) {
        errosName.push("Coloque seu primeiro nome e sobrenome");
        statusCode = 400;
    }

    if(statusCode != 400){
      return 200;
    }else {
      return errosName;
    }
  }  
      
  async function validateEmail(email) {

    let emailErros = [];
    let statusCode = 200;

    const comprimentoMinimo = 8;
    const comprimentoMaximo = 50;
    const formatoDoEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.length < comprimentoMinimo || email.length > comprimentoMaximo) {
      emailErros.push("O tamanho do email está muito grande ou pequeno");
      statusCode = 400;
    }

    if (!formatoDoEmail.test(email)) {
      emailErros.push("O email está no formato errado, formato certo: exemplo@exemplo.com");
      statusCode = 400;
    }

    if(statusCode != 400){
      return 200;
    }else {
      return emailErros;
    }

  }

  function validatePassword(password) {

    let passwordErrors = [];
    let statusCode = 200;
  
    const comprimentoMinimo = 8;
    
    const regexMaiuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /\d/;
    const regexEspecial = /[!@#$%^&*]/;
    
    if (password.length < comprimentoMinimo) {
      passwordErrors.push("O tamanho da senha está muito pequena");
      statusCode = 400;
    }
    
    if (!regexMaiuscula.test(password) || !regexMinuscula.test(password)) {
      passwordErrors.push("A senha precisa conter letras minusculas e maisculas");
      statusCode = 400;
    }
    
    if (!regexNumero.test(password)) {
      passwordErrors.push("A senha precisa conter numeros");
      statusCode = 400;
    }
    
    if (!regexEspecial.test(password)) {
      passwordErrors.push("A senha precisa conter caracteres especias como #$@&...");
      statusCode = 400;
    }
  
    // if(password != confirmPassword){
    //   passwordErrors.push("A senha precisa ser igual ao confirmar senha");
    //   statusCode = 400;
    // }

    if(statusCode != 400){
      return 200;
    }else {
      return passwordErrors;
    }
  }
    
  async function runValidation(data) {

    const isNameRight = validateName(data.name);
    const isEmailRight = await validateEmail(data.email);
    const isPasswordRight = validatePassword(data.password, data.confirmPassword);


    if(isNameRight == 200){
      if(isEmailRight == 200){
        if(isPasswordRight == 200){

          databaseUser.update(NewUser).into('users').where({email: NewUserValidation.email}).then(NewUser => {          
            res.send("you suceffully added: " + NewUser.email); 
            return           

          }).catch(error => {
            console.log(error);
          })  
        }else{
          res.send(isPasswordRight);
          return
        }
      }else{
        res.send(isEmailRight);
        return
      }
    }else{
      res.send(isNameRight);
      return
    }
  }
    
  runValidation(NewUserValidation);
  return

})

router.delete('/users',(req,res) => {

  let emailName = req.body.emailUser;

  let email = emailName;

  databaseUser.select().table('users').where({email: email}).then(users => {

      if(users.length > 0 ){
          databaseUser.delete().where({email: email}).table('users').then(data => {
      
              res.statusCode = 200;
              console.log('suceffuly delete the user: ', email);
              res.send('suceffuly delete the user: ' + email);
                        
          }).catch(error => {
              console.log(error);
          })

      }else{
          console.log('this user dont exist')
          res.sendStatus(400);
      }
  })
})



module.exports = router;