const http = require('http');
const app = require('./app');

//connexion au serveur sur le port 3000 si non occupé
app.set('port',process.env.PORT||3000);
const server = http.createServer(app);

server.listen(process.env.PORT||3000);