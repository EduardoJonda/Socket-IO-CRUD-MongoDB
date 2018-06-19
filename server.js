var express = require('express'),
http = require('http'),
app = express(),
user = require('./models/user'),
server = http.createServer(app),
io = require('socket.io').listen(server),
port = process.env.PORT || '3200';

app.set('view engine', 'jade');

app.use('/static', express.static('public'));

app.get('/', function( request, response ){
	response.render('main');
});

server.listen(3200, function(){
	console.log("Servidor corriendo en el puerto" + port);
});

	io.on('connection', function(socket){
	console.log('Usuario conectado');

		user.show(function(dat){
			socket.emit('listar', dat);
		});

		socket.on('actualizar', function(data){
			user.update(data, function(rpta){
				io.emit('nuevo', rpta);
			});
		});

		socket.on('crear', function(data){
			user.create(data, function(response){
				io.emit('nuevo', response);
			});
			console.log(data);
		});

		socket.on('eliminar', function(data){
			user.delete(data, function(rpta){
				io.emit('borrado', rpta);
			});
		});
		
			socket.on('disconnect', function(){
				console.log('Usuario desconectado');
			});

    });