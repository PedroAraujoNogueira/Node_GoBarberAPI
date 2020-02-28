// O sucrase permite utilizar funcionalidades mais novas do JS, como o import e export por
// exemplo.

// const App = require('./app')
import App from './app';


App.listen(3333); // Foi colocado em um arquivo separado porque nos testes funcionais
// automatizados nao é necessario inicializar o servidor em uma porta, logo separando em
// outro arquivo ira facilitar nossos teste.

// OBS: Podemos rodar nosso servidor usando o comando yarn sucrase-node src/server.js, porem
// queremos rodar com o nodemon(pois ele identifica alteraçoes no noss codigo e reinicia
// o servidor de forma automatica) e para isso precisamos configurar algumas coisas no arquivo
// nodemon.json e no package.json fazendo o script dev. No arquivo nodemon.json colocamos
// um comando que diz que para todo arquivo que termina com a extensao JS sera rodado o
// sucrase antes da inicializacao do node(flag -r).
