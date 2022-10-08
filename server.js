const express = require('express')
const path = require('path')
const socket = require('socket.io');
const app = express()
const port = 8000

// Data
let tasks = [{id: 0, name: 'walk the dog'}];
// Express server
app.use(express.static(path.join(__dirname,'client/build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'client/build/index.html'))
})
const server = app.listen(port, () => {
    console.log(`to-do app listening on port ${port}`)
})
// Websocket communication
const io = socket(server, {
    cors: {
        origin: '*',
    }
});
io.on('connection', (socket) => {
    socket.emit('updateData', tasks)
    console.log('New client! Its id – ' + socket.id);
    socket.on('removeTask', (id) => {
        tasks = tasks.filter((task) => {return task.id !== id})
        socket.broadcast.emit('removeTask', id)
    })
    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task)
    })
});
