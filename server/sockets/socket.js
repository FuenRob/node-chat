const { io } = require('../server');
const {User} = require('../classes/user');
const {sentMessage} = require('../utils/utils');
const user = new User();

io.on('connection', (client) => {
    client.on('entryChat', (data, callback) => {
        if(!data.name || !data.room){
            return callback({
                error: true,
                message: 'El nombre y sala son necesarios'
            });
        }
        client.join(data.room);
        let people = user.addPleople(client.id, data.name, data.room);
        client.broadcast.to(data.room).emit('listPeople', user.getPeopleByRoom(data.room));
        client.broadcast.to(data.room).emit('sentMessage', sentMessage('Administrador', `${data.name} ha entrado`));
        callback(user.getPeopleByRoom(data.room));
    });

    client.on('sentMessage', (data, callback) => {
        let userChat = user.getPeopleById(client.id);
        let message = sentMessage(userChat.name, data.message);
        client.broadcast.to(userChat.room).emit('sentMessage', message);
        callback(message);
    });

    client.on('sentPrivate', (data) => {
        let userChat = user.getPeopleById(client.id);
        let message = sentMessage(userChat.name, data.message);
        client.broadcast.to(data.to).emit('sentMessage', message);
    });

    client.on('disconnect', () => {
        let peopleDrop = user.deletePeople(client.id);
        client.broadcast.to(peopleDrop.room).emit('sentMessage', sentMessage('Administrador', `${peopleDrop.name} ha abandonado el chat`));
        client.broadcast.to(peopleDrop.room).emit('listPeople', user.getPeopleByRoom(peopleDrop.room));
    })

});
