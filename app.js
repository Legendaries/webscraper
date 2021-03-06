const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ip = require('ip');

const scraper = require('./scraper');

const htmlPort = process.env.S_HTML_PORT || 8080;
const socketPort = process.env.S_SOCKET_PORT || 8081;

// Serve the HTML Page
app.get('/', (req, res) => {
    let options = {root: __dirname + '/public/'};
    res.sendFile('/index.html', options)
});

app.get('/index.js', (req, res) => {
    let options = {root: __dirname + '/public/'};
    res.sendFile('/index.js', options)
});

app.get('/ipinfo', (req, res) => {
   res.json({
       address: ip.address(),
       port: socketPort,
   });
});

app.listen(htmlPort);
console.log(`Listening on port ${htmlPort}`);

// Start Socket Server
server.listen(socketPort);
io.on('connection', client => {
    console.log('Client connected...');

    client.on('request', msg => {
        console.log(`message received ${msg}`);

        if (msg.includes('http')) {
            console.log('Searching url');
            scraper.url(msg).then(people => {
                people.forEach(person => scraper.person(person).then(person => {
                    client.emit('response', person);
                }));
            });
        } else {
            console.log('Searching person');
            scraper.person(msg).then(person => {
               client.emit('response', person);
            });
        }
    });
});