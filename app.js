const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const scraper = require('./scraper');

const htmlPort = 8080;
const socketPort = 8081;

// Serve the HTML Page
app.get('/', (req, res) => {
    let options = {root: __dirname + '/public/'};
    res.sendFile('/index.html', options)
});

app.get('/index.js', (req, res) => {
    let options = {root: __dirname + '/public/'};
    res.sendFile('/index.js', options)
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