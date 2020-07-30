const http = require('http');

const server = http.createServer((req, res) => {
    res.write("Hiiiiii");
    res.end();
})

server.listen(8000);