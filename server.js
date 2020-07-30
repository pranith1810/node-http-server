const http = require('http');
const fs = require('fs');
const uuid = require('uuid4');

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
    let urlInParts = req.url.split('/');
    switch (urlInParts[1]) {
        case 'html':
            promiseReadFile('public/index.html')
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

        case 'json':
            promiseReadFile('data/data.json')
                .then((data) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(data);
                    res.end();
                })
                .catch((err) => {
                    console.error('Error while reading the data.json file ' + err);
                });
            break;

        case 'uuid':
            let id = uuid();
            let idObj = {
                'uuid': id
            }
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(idObj, null, 4));
            res.end();
            break;

        case 'status':
            let flag = 0;
            for (code in http.STATUS_CODES) {
                if (code === urlInParts[2]) {
                    res.writeHead(Number(code));
                    res.write(http.STATUS_CODES[code]);
                    res.end();
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                res.writeHead(404);
                res.write('404 File Not Found!!');
                res.end();
            }
            break;

        default:
            res.writeHead(404);
            res.write('404 File Not Found!!');
            res.end();
    }
});

server.listen(8000);