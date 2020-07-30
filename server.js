const http = require('http');
const fs = require('fs');

const promiseReadFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
};

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/html':
            promiseReadFile('./index.html')
                .then((data) => {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    })
                    res.write(data);
                    res.end();
                })
                .catch((err) => {
                    console.error('Error while reading the index.html file ' + err);
                });
            break;

        default:
            res.writeHead(404);
            res.write('404 File Not Found!!');
            res.end();
    }
});

server.listen(8000);