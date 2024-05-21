const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let salesData = {
    mtdSale: 459936,
    monthTarget: 800000,
    yesterdaySale: 25794,
    todaySale: 39544,
    mtdBooking: 523049,
    todayBooking: 22049
};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('updateData', salesData);

    socket.on('updateSalesData', (data) => {
        salesData = data;
        io.emit('updateData', salesData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
