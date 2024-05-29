const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the dashboard at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin.html for the admin panel at /admin URL
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

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
